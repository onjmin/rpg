"use strict";
(() => {
  // node_modules/.pnpm/@onjmin+koe@1.0.11/node_modules/@onjmin/koe/dist/index.js
  var u8 = Uint8Array;
  var u16 = Uint16Array;
  var i32 = Int32Array;
  var fleb = new u8([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0,
    /* unused */
    0,
    0,
    /* impossible */
    0
  ]);
  var fdeb = new u8([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    /* unused */
    0,
    0
  ]);
  var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var freb = function(eb, start) {
    var b = new u16(31);
    for (var i2 = 0; i2 < 31; ++i2) {
      b[i2] = start += 1 << eb[i2 - 1];
    }
    var r = new i32(b[30]);
    for (var i2 = 1; i2 < 30; ++i2) {
      for (var j = b[i2]; j < b[i2 + 1]; ++j) {
        r[j] = j - b[i2] << 5 | i2;
      }
    }
    return { b, r };
  };
  var _a = freb(fleb, 2);
  var fl = _a.b;
  var revfl = _a.r;
  fl[28] = 258, revfl[258] = 28;
  var _b = freb(fdeb, 0);
  var fd = _b.b;
  var revfd = _b.r;
  var rev = new u16(32768);
  for (i = 0; i < 32768; ++i) {
    x = (i & 43690) >> 1 | (i & 21845) << 1;
    x = (x & 52428) >> 2 | (x & 13107) << 2;
    x = (x & 61680) >> 4 | (x & 3855) << 4;
    rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
  }
  var x;
  var i;
  var flt = new u8(288);
  for (i = 0; i < 144; ++i)
    flt[i] = 8;
  var i;
  for (i = 144; i < 256; ++i)
    flt[i] = 9;
  var i;
  for (i = 256; i < 280; ++i)
    flt[i] = 7;
  var i;
  for (i = 280; i < 288; ++i)
    flt[i] = 8;
  var i;
  var fdt = new u8(32);
  for (i = 0; i < 32; ++i)
    fdt[i] = 5;
  var i;
  var et = /* @__PURE__ */ new u8(0);
  var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
  var tds = 0;
  try {
    td.decode(et, { stream: true });
    tds = 1;
  } catch (e) {
  }
  var MAGIC = 1263486208;
  function parseKoeHeader(headerBytes) {
    const view = new DataView(headerBytes);
    if (view.byteLength < 8 || view.getUint32(0, false) !== MAGIC) {
      throw new Error("Not a .koe file (bad magic)");
    }
    return { jsonLength: view.getUint32(4, true) };
  }
  var pcmBase = (jsonLength) => 8 + jsonLength;
  var MAX_PHONEME_SAMPLES = 5242880;
  var MAX_JSON_LENGTH = 50 * 1024 * 1024;
  var BlobVoiceSource = class {
    constructor(blob, base) {
      this.blob = blob;
      this.base = base;
    }
    blob;
    base;
    readBytes(offset, length) {
      const start = this.base + offset;
      return this.blob.slice(start, start + length).arrayBuffer();
    }
  };
  var RangeVoiceSource = class {
    constructor(url, base) {
      this.url = url;
      this.base = base;
    }
    url;
    base;
    async readBytes(offset, length) {
      const start = this.base + offset;
      return rangeFetch(this.url, start, length);
    }
  };
  async function rangeFetch(url, start, length) {
    const res = await fetch(url, {
      headers: { Range: `bytes=${start}-${start + length - 1}` },
      credentials: "omit"
      // never leak cookies / auth to a MML-supplied URL
    });
    if (res.status !== 206) {
      throw new Error(
        `.koe fetch failed: expected 206 Partial Content, got ${res.status}`
      );
    }
    return readCapped(res, length);
  }
  async function readCapped(res, length) {
    const reader = res.body?.getReader();
    if (!reader) {
      const buf = await res.arrayBuffer();
      if (buf.byteLength > length) {
        throw new Error(
          `.koe fetch failed: response exceeds requested ${length} bytes`
        );
      }
      return buf;
    }
    const out = new Uint8Array(length);
    let received = 0;
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) break;
      if (received + value.byteLength > length) {
        await reader.cancel();
        throw new Error(
          `.koe fetch failed: response exceeds requested ${length} bytes`
        );
      }
      out.set(value, received);
      received += value.byteLength;
    }
    return received === length ? out.buffer : out.buffer.slice(0, received);
  }
  function validateJsonLength(jsonLength) {
    if (!Number.isInteger(jsonLength) || jsonLength < 0 || jsonLength > MAX_JSON_LENGTH) {
      throw new Error(`manifest JSON length out of bounds: ${jsonLength}`);
    }
  }
  function parseManifest(json) {
    const manifest = JSON.parse(new TextDecoder().decode(json));
    if (!manifest || typeof manifest !== "object" || typeof manifest.phonemes !== "object" || manifest.phonemes === null) {
      throw new Error("invalid manifest: missing phonemes table");
    }
    return manifest;
  }
  var VoiceBank = class _VoiceBank {
    constructor(manifest, source) {
      this.manifest = manifest;
      this.source = source;
    }
    manifest;
    source;
    /**
     * Parse a .koe archive header + manifest and bind a lazy PCM source.
     * @param koe a Blob/File of the .koe archive, or a URL (served with Range support)
     */
    static async load(koe) {
      try {
        if (typeof koe === "string") {
          if (/^blob:/i.test(koe)) {
            const res = await fetch(koe);
            if (!res.ok) {
              throw new Error(`blob: URL fetch failed: ${res.status}`);
            }
            return await _VoiceBank.fromBlob(await res.blob());
          }
          if (!/^https?:/i.test(koe)) {
            throw new Error(`unsupported URL protocol: ${koe}`);
          }
          const header = await rangeFetch(koe, 0, 8);
          const { jsonLength } = parseKoeHeader(header);
          validateJsonLength(jsonLength);
          const json = await rangeFetch(koe, 8, jsonLength);
          const manifest = parseManifest(json);
          return new _VoiceBank(
            manifest,
            new RangeVoiceSource(koe, pcmBase(jsonLength))
          );
        }
        return await _VoiceBank.fromBlob(koe);
      } catch (error) {
        throw new Error(
          `Failed to load .koe voice bank: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
    static async fromBlob(koe) {
      const header = await koe.slice(0, 8).arrayBuffer();
      const { jsonLength } = parseKoeHeader(header);
      validateJsonLength(jsonLength);
      const json = await koe.slice(8, 8 + jsonLength).arrayBuffer();
      const manifest = parseManifest(json);
      return new _VoiceBank(
        manifest,
        new BlobVoiceSource(koe, pcmBase(jsonLength))
      );
    }
    /** True if the bank contains a phoneme under this alias. */
    has(phoneme) {
      return Object.hasOwn(this.manifest.phonemes, phoneme);
    }
    /**
     * Raw Int16 PCM bytes (48 kHz / mono) for a phoneme, or null if unknown.
     * The returned ArrayBuffer is freshly allocated and safe to transfer to a
     * worker / AudioWorklet.
     */
    async readPcmBytes(phoneme) {
      if (!Object.hasOwn(this.manifest.phonemes, phoneme)) return null;
      const entry = this.manifest.phonemes[phoneme];
      if (!Number.isInteger(entry.offset) || !Number.isInteger(entry.length) || entry.offset < 0 || entry.length < 0 || entry.length > MAX_PHONEME_SAMPLES) {
        throw new Error(`manifest entry out of bounds for phoneme: ${phoneme}`);
      }
      return this.source.readBytes(entry.offset, entry.length * 2);
    }
    /**
     * A phoneme's PCM as a Float64Array normalised to [-1, 1], or null if unknown.
     * Intended for external analysis / resynthesis such as the WORLD vocoder.
     */
    async getPcm(phoneme) {
      const buf = await this.readPcmBytes(phoneme);
      if (!buf) return null;
      const int16 = new Int16Array(buf, 0, Math.floor(buf.byteLength / 2));
      const f64 = new Float64Array(int16.length);
      for (let i2 = 0; i2 < int16.length; i2++) f64[i2] = int16[i2] / 32768;
      return f64;
    }
  };
  var WORLDLINE_SAMPLE_RATE = 48e3;
  var MIN_WORLDLINE_SAMPLES = 4096;
  var SYNTH_REQ_SIZE = 120;
  var WL_FRAME_MS = 10;
  var sampleCurve = (input, curve, totalMs) => typeof curve === "function" ? curve(input, totalMs) : curve;
  var samplesToMs = (samples) => samples / WORLDLINE_SAMPLE_RATE * 1e3;
  function leadInFromEntry(entry) {
    return {
      preMs: samplesToMs(entry.pre || 0),
      consonantMs: samplesToMs(entry.consonant || 0)
    };
  }
  var moduleCache = /* @__PURE__ */ new Map();
  function injectScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(
        `script[data-koe-worldline="${src}"]`
      );
      if (existing) {
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.dataset.koeWorldline = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`worldline: failed to load ${src}`));
      document.head.appendChild(s);
    });
  }
  function loadWasm(scriptUrl) {
    const cached = moduleCache.get(scriptUrl);
    if (cached) return cached;
    const baseUrl = scriptUrl.slice(0, scriptUrl.lastIndexOf("/") + 1);
    const instantiate = () => {
      const factory = globalThis.WorldlineModule;
      if (!factory)
        throw new Error(
          "worldline: WorldlineModule global was not defined by the script"
        );
      return factory({ locateFile: (f) => baseUrl + f });
    };
    let promise;
    if (typeof document !== "undefined") {
      promise = injectScript(scriptUrl).then(instantiate);
    } else if (typeof globalThis.importScripts === "function") {
      promise = Promise.resolve().then(() => {
        globalThis.importScripts(scriptUrl);
        return instantiate();
      });
    } else {
      return Promise.reject(
        new Error(
          "Worldline.load requires a DOM or a classic Web Worker (importScripts) to load worldline.js"
        )
      );
    }
    moduleCache.set(scriptUrl, promise);
    return promise;
  }
  var Worldline = class _Worldline {
    constructor(wasm) {
      this.wasm = wasm;
    }
    wasm;
    sampleRate = WORLDLINE_SAMPLE_RATE;
    /**
     * Load + instantiate the worldline WASM module (deduped per scriptUrl).
     *
     * Works on the main thread (loads via `<script>`) and inside a classic Web
     * Worker (loads via `importScripts`), so the heavy synthesis can run
     * off-thread. The matching `worldline.wasm` is fetched next to scriptUrl.
     */
    static async load(options) {
      return new _Worldline(await loadWasm(options.scriptUrl));
    }
    /**
     * Render one note to Float32 PCM at 48 kHz.
     *
     * The output buffer is laid out as [lead-in/consonant ≈ preMs][vowel ≈
     * durationMs], rendered from sample offset 0 (no leading silence). The vowel
     * onset (the "beat") sits at ≈ preMs into the buffer, so a sequencer should
     * place the buffer at `beatTime − preMs` and may trim/crossfade the lead-in.
     *
     * No internal crossfade is applied — apply fades externally.
     *
     * @returns Float32 PCM, or null when `pcm` is shorter than
     *          {@link MIN_WORLDLINE_SAMPLES} (too short for stable F0 analysis).
     */
    renderPhrase(params) {
      const {
        units,
        pitch,
        gender = 0.5,
        tension = 0.5,
        breathiness = 0.5,
        voicing = 1,
        tempo = 120
      } = params;
      if (units.length === 0) return null;
      const WL = this.wasm;
      const FS2 = WORLDLINE_SAMPLE_RATE;
      let totalMs = 0;
      for (const u of units) {
        const endMs = u.posMs + u.lengthMs;
        if (endMs > totalMs) totalMs = endMs;
      }
      const ps = WL._PhraseSynthNew();
      if (!ps) return null;
      const pointersToFree = [];
      for (const u of units) {
        if (!u.pcm || u.pcm.length < MIN_WORLDLINE_SAMPLES) continue;
        const reqPtr = WL._malloc(SYNTH_REQ_SIZE);
        if (!reqPtr) continue;
        pointersToFree.push(reqPtr);
        const samplePtr = WL._malloc(u.pcm.length * 8);
        if (!samplePtr) continue;
        pointersToFree.push(samplePtr);
        WL.HEAPF64.set(u.pcm, samplePtr >> 3);
        const sv = (off, val, type) => WL.setValue(reqPtr + off, val, type);
        sv(0, FS2, "i32");
        sv(4, u.pcm.length, "i32");
        sv(8, samplePtr, "*");
        sv(12, 0, "i32");
        sv(16, 0, "*");
        sv(20, u.tone ?? 69, "i32");
        sv(24, 100, "double");
        sv(32, 0, "double");
        sv(40, u.requiredLengthMs ?? u.lengthMs, "double");
        sv(48, u.consonantMs, "double");
        const cutMs = u.cutMs ?? WL_FRAME_MS * 2;
        sv(56, cutMs, "double");
        sv(64, u.volume ?? 100, "double");
        sv(72, 0, "double");
        sv(80, tempo, "double");
        sv(88, 0, "i32");
        sv(92, 0, "*");
        sv(96, 0, "i32");
        sv(100, 0, "i32");
        sv(104, 100, "i32");
        sv(108, 0, "i32");
        sv(112, 0, "i32");
        sv(116, 100, "i32");
        WL._PhraseSynthAddRequest(
          ps,
          reqPtr,
          u.posMs,
          u.skipMs,
          u.lengthMs,
          u.fadeInMs,
          u.fadeOutMs,
          0
        );
      }
      totalMs += WL_FRAME_MS * 2;
      const nFrames = Math.ceil(totalMs / WL_FRAME_MS) + 4;
      const f0Arr = new Float64Array(nFrames);
      const gArr = new Float64Array(nFrames);
      const tArr = new Float64Array(nFrames);
      const bArr = new Float64Array(nFrames);
      const vArr = new Float64Array(nFrames);
      for (let i2 = 0; i2 < nFrames; i2++) {
        const tMs = i2 * WL_FRAME_MS;
        f0Arr[i2] = sampleCurve(tMs, pitch, totalMs);
        gArr[i2] = sampleCurve(tMs, gender, totalMs);
        tArr[i2] = sampleCurve(tMs, tension, totalMs);
        bArr[i2] = sampleCurve(tMs, breathiness, totalMs);
        vArr[i2] = sampleCurve(tMs, voicing, totalMs);
      }
      const f0Ptr = WL._malloc(nFrames * 8);
      const gPtr = WL._malloc(nFrames * 8);
      const tPtr = WL._malloc(nFrames * 8);
      const bPtr = WL._malloc(nFrames * 8);
      const vPtr = WL._malloc(nFrames * 8);
      if (f0Ptr && gPtr && tPtr && bPtr && vPtr) {
        WL.HEAPF64.set(f0Arr, f0Ptr >> 3);
        WL.HEAPF64.set(gArr, gPtr >> 3);
        WL.HEAPF64.set(tArr, tPtr >> 3);
        WL.HEAPF64.set(bArr, bPtr >> 3);
        WL.HEAPF64.set(vArr, vPtr >> 3);
        WL._PhraseSynthSetCurves(
          ps,
          f0Ptr,
          gPtr,
          tPtr,
          bPtr,
          vPtr,
          nFrames,
          WL_FRAME_MS
        );
      }
      if (f0Ptr) WL._free(f0Ptr);
      if (gPtr) WL._free(gPtr);
      if (tPtr) WL._free(tPtr);
      if (bPtr) WL._free(bPtr);
      if (vPtr) WL._free(vPtr);
      const yPtrPtr = WL._malloc(4);
      let audio = null;
      if (yPtrPtr) {
        const outLen = WL._PhraseSynthSynth(ps, yPtrPtr, 0);
        const yPtr = WL.getValue(yPtrPtr, "*");
        if (outLen > 0 && yPtr) {
          audio = new Float32Array(WL.HEAPF32.buffer, yPtr, outLen).slice();
          WL._free(yPtr);
        }
        WL._free(yPtrPtr);
      }
      for (const ptr of pointersToFree) {
        WL._free(ptr);
      }
      WL._PhraseSynthDelete(ps);
      return audio;
    }
    renderNote(params) {
      const {
        pcm,
        pitch,
        durationMs,
        preMs,
        consonantMs,
        tempo = 120,
        gender = 0.5,
        tension = 0.5,
        breathiness = 0.5,
        voicing = 1
      } = params;
      if (!pcm || pcm.length < MIN_WORLDLINE_SAMPLES) return null;
      const WL = this.wasm;
      const FS2 = WORLDLINE_SAMPLE_RATE;
      const basePitch = sampleCurve(
        preMs + durationMs / 2,
        pitch,
        preMs + durationMs
      );
      const midiNote = Math.round(69 + 12 * Math.log2(basePitch / 440));
      const posMs = 0;
      const reqLen = preMs + durationMs;
      const cutMs = WL_FRAME_MS * 2;
      const ps = WL._PhraseSynthNew();
      if (!ps) return null;
      const reqPtr = WL._malloc(SYNTH_REQ_SIZE);
      if (!reqPtr) {
        WL._PhraseSynthDelete(ps);
        return null;
      }
      const samplePtr = WL._malloc(pcm.length * 8);
      if (!samplePtr) {
        WL._free(reqPtr);
        WL._PhraseSynthDelete(ps);
        return null;
      }
      WL.HEAPF64.set(pcm, samplePtr >> 3);
      const sv = (off, val, type) => WL.setValue(reqPtr + off, val, type);
      sv(0, FS2, "i32");
      sv(4, pcm.length, "i32");
      sv(8, samplePtr, "*");
      sv(12, 0, "i32");
      sv(16, 0, "*");
      sv(20, midiNote, "i32");
      sv(24, 100, "double");
      sv(32, 0, "double");
      sv(40, reqLen, "double");
      sv(48, consonantMs, "double");
      sv(56, cutMs, "double");
      sv(64, 100, "double");
      sv(72, 0, "double");
      sv(80, tempo, "double");
      sv(88, 0, "i32");
      sv(92, 0, "*");
      sv(96, 0, "i32");
      sv(100, 0, "i32");
      sv(104, 100, "i32");
      sv(108, 0, "i32");
      sv(112, 0, "i32");
      sv(116, 100, "i32");
      WL._PhraseSynthAddRequest(ps, reqPtr, posMs, 0, reqLen, 0, 0, 0);
      WL._free(samplePtr);
      WL._free(reqPtr);
      const totalMs = posMs + reqLen + WL_FRAME_MS * 2;
      const nFrames = Math.ceil(totalMs / WL_FRAME_MS) + 4;
      const f0Arr = new Float64Array(nFrames);
      const gArr = new Float64Array(nFrames);
      const tArr = new Float64Array(nFrames);
      const bArr = new Float64Array(nFrames);
      const vArr = new Float64Array(nFrames);
      for (let i2 = 0; i2 < nFrames; i2++) {
        const tMs = i2 * WL_FRAME_MS;
        f0Arr[i2] = sampleCurve(tMs, pitch, totalMs);
        gArr[i2] = sampleCurve(tMs, gender, totalMs);
        tArr[i2] = sampleCurve(tMs, tension, totalMs);
        bArr[i2] = sampleCurve(tMs, breathiness, totalMs);
        vArr[i2] = sampleCurve(tMs, voicing, totalMs);
      }
      const f0Ptr = WL._malloc(nFrames * 8);
      const gPtr = WL._malloc(nFrames * 8);
      const tPtr = WL._malloc(nFrames * 8);
      const bPtr = WL._malloc(nFrames * 8);
      const vPtr = WL._malloc(nFrames * 8);
      if (!f0Ptr || !gPtr || !tPtr || !bPtr || !vPtr) {
        if (f0Ptr) WL._free(f0Ptr);
        if (gPtr) WL._free(gPtr);
        if (tPtr) WL._free(tPtr);
        if (bPtr) WL._free(bPtr);
        if (vPtr) WL._free(vPtr);
        WL._PhraseSynthDelete(ps);
        return null;
      }
      WL.HEAPF64.set(f0Arr, f0Ptr >> 3);
      WL.HEAPF64.set(gArr, gPtr >> 3);
      WL.HEAPF64.set(tArr, tPtr >> 3);
      WL.HEAPF64.set(bArr, bPtr >> 3);
      WL.HEAPF64.set(vArr, vPtr >> 3);
      WL._PhraseSynthSetCurves(
        ps,
        f0Ptr,
        gPtr,
        tPtr,
        bPtr,
        vPtr,
        nFrames,
        WL_FRAME_MS
      );
      WL._free(f0Ptr);
      WL._free(gPtr);
      WL._free(tPtr);
      WL._free(bPtr);
      WL._free(vPtr);
      const yPtrPtr = WL._malloc(4);
      if (!yPtrPtr) {
        WL._PhraseSynthDelete(ps);
        return null;
      }
      const outLen = WL._PhraseSynthSynth(ps, yPtrPtr, 0);
      const yPtr = WL.getValue(yPtrPtr, "*");
      const audio = outLen > 0 && yPtr ? new Float32Array(WL.HEAPF32.buffer, yPtr, outLen).slice() : null;
      if (yPtr) WL._free(yPtr);
      WL._free(yPtrPtr);
      WL._PhraseSynthDelete(ps);
      return audio;
    }
  };
  var RATE = 16e3;
  var HOP_MS = 2;
  var HOP = RATE * HOP_MS / 1e3;
  var FFT_SIZE = 512;
  var BINS = FFT_SIZE / 2;
  var PITCH_DECIM = 2;
  var PITCH_RATE = RATE / PITCH_DECIM;
  var WINDOW_CENTRE_MS = FFT_SIZE / 2 / RATE * 1e3;
  function sparse_features(token) {
    if (token.pause || token.accent_phrase_position === void 0 || token.accent_phrase_length === void 0 || token.accent_nucleus === void 0) {
      return {};
    }
    const phrase_length = Math.max(1, token.accent_phrase_length);
    const phrase_position = token.accent_phrase_position;
    const nucleus = token.accent_nucleus;
    const result = {
      "accent_position": phrase_position / phrase_length,
      "accent_from_end": (phrase_length - phrase_position) / phrase_length,
      "accent_nucleus_position": nucleus / phrase_length,
      "accent_high": token.accent_high ? 1 : 0,
      "accent_phrase_start": token.accent_phrase_start ? 1 : 0,
      "accent_phrase_end": token.accent_phrase_end ? 1 : 0,
      "word_start": token.word_start ? 1 : 0,
      "word_end": token.word_end ? 1 : 0
    };
    result[`pos=${token.pos || "*"}`] = 1;
    result[`pos_group1=${token.pos_group1 || "*"}`] = 1;
    if (nucleus === 0) {
      result["accent_type=heiban"] = 1;
    } else if (phrase_position < nucleus) {
      result["accent_type=before"] = 1;
    } else if (phrase_position === nucleus) {
      result["accent_type=nucleus"] = 1;
    } else {
      result["accent_type=after"] = 1;
    }
    return result;
  }
  function readingFromFeatures(features) {
    return features.map((frame) => frame.pause ? "\u3001" : frame.mora).join("");
  }
  var FS = WORLDLINE_SAMPLE_RATE;
  var msToSamples2 = (ms) => Math.round(ms / 1e3 * FS);
  function rmsDb(pcm, from, to) {
    const a = Math.max(0, from);
    const b = Math.min(pcm.length, to);
    if (b <= a) return Number.NaN;
    let sum = 0;
    for (let k = a; k < b; k++) sum += pcm[k] * pcm[k];
    return 10 * Math.log10(sum / (b - a) + 1e-12);
  }
  function applyGainFrames(pcm, framesDb, frameSamples) {
    const last = framesDb.length - 1;
    if (last < 0) return;
    for (let k = 0; k < pcm.length; k++) {
      const position = k / frameSamples - 0.5;
      const left = Math.min(last, Math.max(0, Math.floor(position)));
      const right = Math.min(last, left + 1);
      const t = Math.min(1, Math.max(0, position - left));
      pcm[k] *= 10 ** ((framesDb[left] * (1 - t) + framesDb[right] * t) / 20);
    }
  }
  function softLimit2(pcm, threshold) {
    const range = 1 - threshold;
    if (range <= 0) return;
    for (let k = 0; k < pcm.length; k++) {
      const x2 = pcm[k];
      const a = Math.abs(x2);
      if (a <= threshold) continue;
      const y = threshold + range * Math.tanh((a - threshold) / range);
      pcm[k] = x2 < 0 ? -y : y;
    }
  }
  function f0At(timeline, tMs) {
    const curve = timeline.f0_curve;
    if (curve.length === 0) return timeline.reference_hz || 220;
    const position = Math.max(0, tMs) / timeline.frame_ms;
    const left = Math.floor(position);
    if (left >= curve.length - 1) return curve[curve.length - 1];
    const progress = position - left;
    return curve[left] * (1 - progress) + curve[left + 1] * progress;
  }
  function applyMoraGains(plan, gains) {
    const morae = plan.morae ?? [];
    const timings = plan.mora_timings ?? [];
    const byIndex = morae.length === gains.length;
    const moraAt = (unit) => {
      if (byIndex) return unit.position;
      let found = -1;
      for (let i2 = 0; i2 < timings.length && i2 < gains.length; i2++) {
        if (timings[i2].StartMS <= unit.note_start_ms + 1e-6) found = i2;
        else break;
      }
      return found;
    };
    for (const unit of plan.timeline.units) {
      const index = moraAt(unit);
      const gain = gains[index];
      if (index < 0 || gain === void 0 || !Number.isFinite(gain)) continue;
      unit.volume *= gain;
    }
  }
  function applyConsonantGaps(plan, prosody) {
    const { consonantMs, unvoicedOnset } = prosody;
    if (!consonantMs || !unvoicedOnset) return;
    if (consonantMs.length !== (plan.morae?.length ?? -1)) return;
    const leading = plan.timeline.leading_ms;
    const units = plan.timeline.units;
    for (let i2 = 0; i2 + 1 < units.length; i2++) {
      const unit = units[i2];
      const next = units[i2 + 1];
      if (next.position !== unit.position + 1) continue;
      if (!unvoicedOnset[next.position]) continue;
      const consonant = consonantMs[next.position];
      if (!(consonant > 0)) continue;
      const gapStart = next.note_start_ms + leading - consonant;
      const currentEnd = unit.position_ms + unit.length_ms;
      if (gapStart >= currentEnd) continue;
      const minimumLength = Math.max(
        40,
        unit.fade_in_ms + unit.fade_out_ms + 10,
        unit.note_start_ms + leading - unit.position_ms + 30
      );
      unit.length_ms = Math.max(minimumLength, gapStart - unit.position_ms);
    }
  }
  function planChunks(units, firstChunkUnits, chunkUnits) {
    const ranges = [];
    if (units.length === 0) return ranges;
    let start = 0;
    let coveredEndMs = units[0].position_ms + units[0].length_ms;
    let headSeam = false;
    for (let i2 = 1; i2 <= units.length; i2++) {
      const limit = ranges.length === 0 ? firstChunkUnits : chunkUnits;
      const atEnd = i2 === units.length;
      const clean = !atEnd && units[i2].position_ms >= coveredEndMs - 1e-6;
      const full = !atEnd && i2 - start >= limit;
      if (atEnd || clean || full) {
        const tailSeam = !atEnd && !clean;
        ranges.push({ start, end: i2, headSeam, tailSeam });
        start = i2;
        headSeam = tailSeam;
        if (!atEnd) coveredEndMs = units[i2].position_ms + units[i2].length_ms;
        continue;
      }
      coveredEndMs = Math.max(
        coveredEndMs,
        units[i2].position_ms + units[i2].length_ms
      );
    }
    return ranges;
  }
  function seamTimeMs(next, crossfadeMs) {
    const earliest = next.position_ms + next.fade_in_ms + crossfadeMs / 2;
    const latest = next.position_ms + next.length_ms - crossfadeMs / 2;
    return Math.min(
      earliest,
      Math.max(next.position_ms + crossfadeMs / 2, latest)
    );
  }
  function applyFade(pcm, fromSample, samples, fadeIn) {
    const n = Math.max(1, Math.min(samples, pcm.length - fromSample));
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      const gain = fadeIn ? Math.sin(Math.PI / 2 * t) : Math.cos(Math.PI / 2 * t);
      pcm[fromSample + k] *= gain;
    }
  }
  function median(values) {
    const sorted = values.slice().sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  }
  function shapeLoudness(audio, units, timeline, baseMs, options) {
    const frameMs = timeline.frame_ms > 0 ? timeline.frame_ms : 10;
    const frameSamples = Math.max(1, msToSamples2(frameMs));
    const frames = Math.ceil(audio.length / frameSamples) + 1;
    const curve = new Float64Array(frames);
    if (options.equalize) {
      const anchors = [];
      const measured = [];
      for (const unit of units) {
        if (!(unit.volume > 0) || unit.duration_ms < 30) continue;
        const start = unit.note_start_ms + timeline.leading_ms - baseMs;
        const soundEnd = unit.position_ms - baseMs + unit.length_ms - unit.fade_out_ms;
        const from = msToSamples2(start + unit.duration_ms * 0.35);
        const to = msToSamples2(
          Math.min(start + unit.duration_ms * 0.9, soundEnd)
        );
        if (to - from < msToSamples2(20)) continue;
        const db = rmsDb(audio, from, to);
        if (!Number.isFinite(db) || db < -70) continue;
        measured.push({
          frame: (start + unit.duration_ms * 0.6) / frameMs,
          intrinsicDb: db - 20 * Math.log10(unit.volume / 100)
        });
      }
      if (measured.length > 0) {
        const reference = options.targetDb;
        for (const m of measured) {
          anchors.push({
            frame: m.frame,
            db: Math.max(
              -options.maxDb,
              Math.min(options.maxDb, reference - m.intrinsicDb)
            )
          });
        }
        let a = 0;
        for (let frame = 0; frame < frames; frame++) {
          while (a + 1 < anchors.length && frame >= anchors[a + 1].frame) a++;
          const left = anchors[a];
          const right = anchors[Math.min(anchors.length - 1, a + 1)];
          if (frame <= left.frame || right === left) curve[frame] = left.db;
          else if (frame >= right.frame) curve[frame] = right.db;
          else {
            const t = (frame - left.frame) / (right.frame - left.frame);
            curve[frame] = left.db * (1 - t) + right.db * t;
          }
        }
      }
    }
    if (options.energyDbPerSemitone !== 0 && options.referenceHz > 0) {
      for (let frame = 0; frame < frames; frame++) {
        const f0 = f0At(timeline, baseMs + frame * frameMs);
        if (!(f0 > 0)) continue;
        const semitones = 12 * Math.log2(f0 / options.referenceHz);
        curve[frame] += Math.max(
          -options.energyMaxDb,
          Math.min(options.energyMaxDb, semitones * options.energyDbPerSemitone)
        );
      }
    }
    if (options.devoicedDb < 0) {
      const rampFrames = Math.max(1, Math.round(20 / frameMs));
      for (let i2 = 0; i2 < units.length; i2++) {
        const unit = units[i2];
        if (!unit.devoiced) continue;
        const start = unit.note_start_ms + timeline.leading_ms - baseMs;
        let endMs = start + unit.duration_ms;
        const next = units[i2 + 1];
        if (next) endMs = Math.min(endMs, next.position_ms - baseMs);
        const from = start / frameMs;
        const to = endMs / frameMs;
        for (let frame = Math.max(0, Math.floor(from)); frame < frames && frame < to + rampFrames; frame++) {
          const fadeIn = Math.min(1, Math.max(0, (frame - from) / rampFrames));
          const fadeOut = Math.min(
            1,
            Math.max(0, (to + rampFrames - frame) / rampFrames)
          );
          curve[frame] += options.devoicedDb * Math.min(fadeIn, fadeOut);
        }
      }
    }
    applyGainFrames(audio, curve, frameSamples);
  }
  var UtauTTSAdapter = class _UtauTTSAdapter {
    constructor(worldline2) {
      this.worldline = worldline2;
    }
    worldline;
    static modelId = null;
    bankAliases = /* @__PURE__ */ new WeakMap();
    currentBank = null;
    pcmCache = /* @__PURE__ */ new Map();
    /**
     * Load the UtauTTS Go wasm. `wasm_exec.js` must already be on the page.
     * Pass `fetch` (e.g. koe's `fetchAsset`) to stream from the Cache API.
     */
    static async initializeWasm(wasmUrl = "utautts.wasm", options = {}) {
      if (typeof utautts_plan === "function") return;
      if (typeof Go === "undefined") {
        throw new Error(
          "wasm_exec.js must be loaded before calling initializeWasm."
        );
      }
      const go = new Go();
      const responsePromise = (options.fetch ?? fetch)(wasmUrl);
      let instance;
      try {
        instance = (await WebAssembly.instantiateStreaming(responsePromise, go.importObject)).instance;
      } catch {
        const bytes = await (await (options.fetch ?? fetch)(wasmUrl)).arrayBuffer();
        instance = (await WebAssembly.instantiate(bytes, go.importObject)).instance;
      }
      void go.run(instance);
      for (let attempt = 0; attempt < 100 && typeof utautts_plan !== "function"; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      if (typeof utautts_plan !== "function") {
        throw new Error("utautts_plan failed to initialize in global scope.");
      }
    }
    static get ready() {
      return typeof utautts_plan === "function";
    }
    /** Parse and cache a prosody model (e.g. `frame-intonation-v8.json`) inside the wasm. */
    static setModel(modelJSON) {
      _UtauTTSAdapter.assertReady();
      const result = utautts_set_model(modelJSON);
      if (!result.success)
        throw new Error(`UtauTTS model error: ${result.error}`);
      _UtauTTSAdapter.modelId = result.id ?? null;
      return _UtauTTSAdapter.modelId;
    }
    static get currentModelId() {
      return _UtauTTSAdapter.modelId;
    }
    static assertReady() {
      if (typeof utautts_plan !== "function") {
        throw new Error(
          "UtauTTS wasm is not initialized; call UtauTTSAdapter.initializeWasm() first."
        );
      }
    }
    /**
     * Register a koe voice bank with the planner: the manifest becomes a virtual
     * oto.ini (koe PCM is pre-trimmed, so offset is 0) plus each sample's
     * recorded pitch. Called automatically by {@link plan}; cheap when unchanged.
     */
    setBank(bank2) {
      _UtauTTSAdapter.assertReady();
      if (this.currentBank === bank2 && this.bankAliases.has(bank2)) return;
      const entries = {};
      const pitch = {};
      for (const [alias, phoneme] of Object.entries(bank2.manifest.phonemes)) {
        entries[alias] = [
          {
            Filename: `koe:${alias}`,
            Alias: alias,
            Offset: 0,
            Fixed: phoneme.consonant / 48,
            Blank: 0,
            Preutterance: phoneme.pre / 48,
            Overlap: phoneme.overlap / 48,
            SourceGroup: "koe"
          }
        ];
        if (phoneme.pitch > 0) pitch[alias] = phoneme.pitch;
      }
      const result = utautts_set_bank(
        JSON.stringify({
          name: "koe",
          oto_entries: entries,
          source_pitch_hz: pitch
        })
      );
      if (!result.success) throw new Error(`UtauTTS bank error: ${result.error}`);
      this.bankAliases.set(bank2, result.aliases ?? 0);
      this.currentBank = bank2;
      this.pcmCache.clear();
    }
    /**
     * Plan an utterance: unit selection, timing, pitch contour and worldline
     * placement. `features` are the mora-level frames from `openjtalkAnalyze`
     * (pauses included); the kana reading is derived from them.
     */
    plan(bank2, text, features, options = {}) {
      this.setBank(bank2);
      const request = {
        text,
        reading: readingFromFeatures(features),
        frames: features.map((frame) => sparse_features(frame)),
        tone: options.tone ?? "C4",
        mora_duration_ms: options.moraDurationMs ?? 0,
        pause_duration_ms: options.pauseDurationMs ?? 0,
        release_ms: options.releaseMs ?? 20,
        leading_preutterance_ms: options.leadingPreutteranceMs ?? 0,
        apply_pitch: options.applyPitch ?? true,
        intonation_strength: options.intonationStrength ?? 1,
        speech_timing: options.speechTiming ?? false,
        word_boundary_envelope: options.wordBoundaryEnvelope ?? false,
        mora_durations_ms: options.prosody?.moraDurationsMs,
        pitch_curve: options.prosody?.pitchCurve
      };
      const response = utautts_plan(JSON.stringify(request));
      if (!response.success || !response.plan) {
        throw new Error(`UtauTTS error: ${response.error ?? "no plan"}`);
      }
      const plan = JSON.parse(response.plan);
      const gains = options.prosody?.moraGains;
      if (gains) applyMoraGains(plan, gains);
      const devoiced = options.prosody?.devoiced;
      if (devoiced && devoiced.length === (plan.morae?.length ?? -1)) {
        for (const unit of plan.timeline.units) {
          if (devoiced[unit.position]) unit.devoiced = true;
        }
      }
      if (options.prosody) applyConsonantGaps(plan, options.prosody);
      return plan;
    }
    getPcm(bank2, alias) {
      let cached = this.pcmCache.get(alias);
      if (!cached) {
        cached = bank2.getPcm(alias);
        this.pcmCache.set(alias, cached);
      }
      return cached;
    }
    /**
     * Render a plan chunk by chunk. Each chunk is independent audio positioned
     * at `startMs`; schedule them as they arrive (see the demo) or sum them.
     *
     * Chunk breaks fall on pauses when possible. Inside a phrase a break renders
     * one neighbouring unit of context on each side so the unit crossfade stays
     * WORLD's spectral one, then the two renders are joined with a short
     * equal-power crossfade in the following vowel.
     */
    async *renderChunks(bank2, plan, options = {}) {
      const {
        firstChunkUnits = 3,
        chunkUnits = 6,
        seamCrossfadeMs = 20,
        normalizeUnitLoudness = true,
        unitLoudnessDb = -16,
        unitLoudnessMaxDb = 6,
        energyDbPerSemitone = 0.8,
        energyMaxDb = 6,
        devoicedDb = -9,
        outputLimit = 0.8,
        signal
      } = options;
      const timeline = plan.timeline;
      const units = timeline.units.filter((unit) => unit.length_ms > 0);
      const voicedF0 = timeline.f0_curve.filter((hz) => hz > 0);
      const referenceHz = voicedF0.length > 0 ? median(voicedF0) : 0;
      const ranges = planChunks(
        units,
        Math.max(1, firstChunkUnits),
        Math.max(1, chunkUnits)
      );
      const crossfadeSamples = Math.max(2, msToSamples2(seamCrossfadeMs));
      for (let index = 0; index < ranges.length; index++) {
        if (signal?.aborted) return;
        const range = ranges[index];
        const renderStart = range.headSeam ? range.start - 1 : range.start;
        const renderEnd = range.tailSeam ? range.end + 1 : range.end;
        const rendered = units.slice(renderStart, renderEnd);
        const baseMs = Math.min(...rendered.map((unit) => unit.position_ms));
        const phraseUnits = [];
        for (const unit of rendered) {
          const pcm2 = await this.getPcm(bank2, unit.alias);
          if (!pcm2 || pcm2.length < MIN_WORLDLINE_SAMPLES) {
            console.warn(
              `[utautts] no usable PCM for alias "${unit.alias}"; skipped`
            );
            continue;
          }
          phraseUnits.push({
            pcm: pcm2,
            posMs: unit.position_ms - baseMs,
            skipMs: unit.skip_ms,
            lengthMs: unit.length_ms,
            fadeInMs: unit.fade_in_ms,
            fadeOutMs: unit.fade_out_ms,
            consonantMs: unit.consonant_ms,
            requiredLengthMs: unit.required_length_ms,
            volume: unit.volume,
            tone: unit.tone
          });
        }
        if (signal?.aborted) return;
        if (phraseUnits.length === 0) continue;
        const audio = this.worldline.renderPhrase({
          units: phraseUnits,
          pitch: (tMs) => f0At(timeline, baseMs + tMs),
          gender: options.gender,
          tension: options.tension,
          breathiness: options.breathiness,
          voicing: options.voicing
        });
        if (!audio || audio.length === 0) continue;
        if (normalizeUnitLoudness || energyDbPerSemitone !== 0 || devoicedDb < 0) {
          shapeLoudness(audio, rendered, timeline, baseMs, {
            equalize: normalizeUnitLoudness,
            targetDb: unitLoudnessDb,
            maxDb: unitLoudnessMaxDb,
            energyDbPerSemitone,
            energyMaxDb,
            devoicedDb,
            referenceHz
          });
        }
        let fromSample = 0;
        let toSample = audio.length;
        let startMs = baseMs;
        if (range.headSeam) {
          const seamMs = seamTimeMs(units[range.start], seamCrossfadeMs);
          fromSample = Math.max(
            0,
            msToSamples2(seamMs - baseMs) - crossfadeSamples / 2
          );
          startMs = baseMs + fromSample / FS * 1e3;
        }
        if (range.tailSeam) {
          const seamMs = seamTimeMs(units[range.end], seamCrossfadeMs);
          toSample = Math.min(
            audio.length,
            msToSamples2(seamMs - baseMs) + crossfadeSamples / 2
          );
        }
        if (toSample <= fromSample) continue;
        const pcm = audio.slice(fromSample, toSample);
        if (outputLimit > 0) softLimit2(pcm, outputLimit);
        if (range.headSeam) applyFade(pcm, 0, crossfadeSamples, true);
        if (range.tailSeam)
          applyFade(
            pcm,
            Math.max(0, pcm.length - crossfadeSamples),
            crossfadeSamples,
            false
          );
        yield { pcm, startMs, index, units: units.slice(range.start, range.end) };
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    /**
     * Plan + render an utterance into one buffer (Float32, 48 kHz) covering the
     * whole timeline. Use {@link plan} + {@link renderChunks} for streaming.
     */
    async synthesizeText(bank2, text, features, options = {}) {
      const plan = this.plan(bank2, text, features, options);
      const total = msToSamples2(plan.timeline.duration_ms) + msToSamples2(200);
      const out = new Float32Array(total);
      let any = false;
      for await (const chunk of this.renderChunks(bank2, plan, options)) {
        any = true;
        const offset = msToSamples2(chunk.startMs);
        const n = Math.min(chunk.pcm.length, out.length - offset);
        for (let k = 0; k < n; k++) out[offset + k] += chunk.pcm[k];
      }
      const limit = options.outputLimit ?? 0.8;
      if (any && limit > 0) softLimit2(out, limit);
      return any ? out : null;
    }
  };

  // src/vibrato.ts
  var VIBRATO_RATE_HZ = 5.5;
  var VIBRATO_DEPTH_CENTS = 35;
  var VIBRATO_FADE_MS = 150;
  var vibratoRatio = (sinceOnsetMs) => {
    if (sinceOnsetMs <= 0) return 1;
    const depth = VIBRATO_DEPTH_CENTS * Math.min(1, sinceOnsetMs / VIBRATO_FADE_MS);
    const cents = depth * Math.sin(2 * Math.PI * VIBRATO_RATE_HZ * sinceOnsetMs / 1e3);
    return 2 ** (cents / 1200);
  };

  // src/pitch-curve.ts
  var STEP_GLIDE_RATIO = 0.35;
  var PORTAMENTO_RATIO = 0.8;
  var MAX_STEP_GLIDE_MS = 120;
  var MAX_PORTAMENTO_MS = 400;
  var MIN_GLIDE_MS = 4;
  var MAX_GLIDE_SPAN_RATIO = 0.9;
  var unitsToHz = (units) => 440 * 2 ** ((units - 2139) / 372);
  var smoothstep = (u) => u * u * (3 - 2 * u);
  var glideMsForSegments = (segments, totalMs) => segments.map((seg, i2) => {
    const atMs = seg.atSec * 1e3;
    const prevMs = i2 === 0 ? 0 : segments[i2 - 1].atSec * 1e3;
    const nextMs = i2 + 1 < segments.length ? segments[i2 + 1].atSec * 1e3 : totalMs ?? atMs + (atMs - prevMs);
    const span = Math.max(0, Math.min(atMs - prevMs, nextMs - atMs));
    const ratio = seg.portamento ? PORTAMENTO_RATIO : STEP_GLIDE_RATIO;
    const cap = seg.portamento ? MAX_PORTAMENTO_MS : MAX_STEP_GLIDE_MS;
    return Math.min(
      Math.max(MIN_GLIDE_MS, Math.min(span * ratio, cap)),
      span * MAX_GLIDE_SPAN_RATIO
    );
  });
  var toKeyframes = (segments, totalMs) => {
    const glides = glideMsForSegments(segments, totalMs);
    return segments.map((seg, i2) => ({
      hz: unitsToHz(seg.pitch),
      startMs: Math.max(0, seg.atSec * 1e3 - glides[i2] / 2),
      glideMs: glides[i2]
    }));
  };
  var pitchCurveFor = (baseHz, segments, preMs, vibrato, totalMs) => {
    const kf = segments?.length ? toKeyframes(segments, totalMs) : null;
    if (!kf && !vibrato) return baseHz;
    return (tMs) => {
      const sinceOnset = tMs - preMs;
      let hz = baseHz;
      if (kf && sinceOnset > 0) {
        for (const k of kf) {
          if (sinceOnset >= k.startMs + k.glideMs) {
            hz = k.hz;
            continue;
          }
          if (sinceOnset <= k.startMs) break;
          const u = smoothstep((sinceOnset - k.startMs) / k.glideMs);
          hz = hz * (k.hz / hz) ** u;
          break;
        }
      }
      return vibrato ? hz * vibratoRatio(sinceOnset) : hz;
    };
  };

  // src/speech.ts
  var prefetchSpeechPcm = (plan, getPcm2, concurrency = 6) => {
    const aliases = [
      ...new Set(
        plan.timeline.units.filter((u) => u.length_ms > 0).map((u) => u.alias)
      )
    ];
    let next = 0;
    const run = async () => {
      while (next < aliases.length) {
        const alias = aliases[next++];
        try {
          await getPcm2(alias);
        } catch {
        }
      }
    };
    for (let i2 = 0; i2 < Math.min(concurrency, aliases.length); i2++) void run();
  };
  var speechBankView = (bank2, getPcm2) => new Proxy(bank2, {
    get: (target, prop, receiver) => prop === "getPcm" ? getPcm2 : Reflect.get(target, prop, receiver)
  });

  // src/voice-worker-types.ts
  var COMPOSITE_ALIAS_SEP = "\0";
  var unpackCompositeAlias = (alias) => {
    if (!alias.startsWith(COMPOSITE_ALIAS_SEP)) return null;
    const parts = alias.slice(COMPOSITE_ALIAS_SEP.length).split(COMPOSITE_ALIAS_SEP);
    return parts.length === 2 ? [parts[0], parts[1]] : null;
  };

  // src/voice-worker.ts
  var KOE_SAMPLE_RATE = 48e3;
  var unitsToFreq = (units) => 440 * 2 ** ((units - 2139) / 372);
  var wself = globalThis;
  var bank = null;
  var worldline = null;
  var speechAdapter = null;
  var speechAborts = /* @__PURE__ */ new Map();
  var pcmCache = /* @__PURE__ */ new Map();
  var getPcm = (alias) => {
    let p = pcmCache.get(alias);
    if (!p) {
      p = bank.getPcm(alias);
      pcmCache.set(alias, p);
    }
    return p;
  };
  var COMPOSITE_SPLICE_XFADE_SEC = 5e-3;
  var spliceCompositePcm = (consonantPcm, vowelPcm, sampleRate) => {
    if (consonantPcm.length === 0 || vowelPcm.length === 0) return null;
    const xfade = Math.min(
      Math.floor(sampleRate * COMPOSITE_SPLICE_XFADE_SEC),
      consonantPcm.length,
      vowelPcm.length
    );
    const pcm = new Float64Array(consonantPcm.length + vowelPcm.length - xfade);
    pcm.set(consonantPcm, 0);
    for (let i2 = 0; i2 < xfade; i2++) {
      const t = (i2 + 1) / (xfade + 1);
      const idx = consonantPcm.length - xfade + i2;
      pcm[idx] = consonantPcm[idx] * (1 - t) + vowelPcm[i2] * t;
    }
    pcm.set(vowelPcm.subarray(xfade), consonantPcm.length);
    const consonantMs = (consonantPcm.length - xfade / 2) / sampleRate * 1e3;
    return { pcm, preMs: consonantMs, consonantMs };
  };
  var renderComposite = async (consonantAlias, vowelAlias, pitch, durationMs, vibrato, gender, breathiness, tension, pitchSegments) => {
    if (!worldline) return null;
    const [consonantPcm, vowelPcm] = await Promise.all([
      getPcm(consonantAlias),
      getPcm(vowelAlias)
    ]);
    if (!consonantPcm || !vowelPcm) return null;
    const spliced = spliceCompositePcm(consonantPcm, vowelPcm, KOE_SAMPLE_RATE);
    if (!spliced) return null;
    const targetHz = unitsToFreq(pitch);
    const audio = worldline.renderNote({
      pcm: spliced.pcm,
      pitch: pitchCurveFor(
        targetHz,
        pitchSegments,
        spliced.preMs,
        !!vibrato,
        durationMs
      ),
      durationMs,
      preMs: spliced.preMs,
      consonantMs: spliced.consonantMs,
      gender,
      breathiness,
      tension
    });
    return audio ? { pcm: audio, preSec: spliced.preMs / 1e3, rate: 1 } : null;
  };
  var renderAlias = async (alias, pitch, durationMs, vibrato, gender, breathiness, tension, pitchSegments) => {
    if (!bank) return null;
    const composite = unpackCompositeAlias(alias);
    if (composite) {
      return renderComposite(
        composite[0],
        composite[1],
        pitch,
        durationMs,
        vibrato,
        gender,
        breathiness,
        tension,
        pitchSegments
      );
    }
    const pcm = await getPcm(alias);
    if (!pcm || pcm.length === 0) return null;
    const entry = bank.manifest.phonemes[alias];
    const lead = leadInFromEntry(entry);
    const targetHz = unitsToFreq(pitch);
    if (worldline) {
      const audio = worldline.renderNote({
        pcm,
        pitch: pitchCurveFor(
          targetHz,
          pitchSegments,
          lead.preMs,
          !!vibrato,
          durationMs
        ),
        durationMs,
        ...lead,
        gender,
        breathiness,
        tension
      });
      if (audio) return { pcm: audio, preSec: lead.preMs / 1e3, rate: 1 };
    }
    const rate = entry.pitch > 0 ? targetHz / entry.pitch : 1;
    return {
      pcm: Float32Array.from(pcm),
      preSec: entry.pre / KOE_SAMPLE_RATE / rate,
      rate
    };
  };
  wself.onmessage = async (ev) => {
    const msg = ev.data;
    if (msg.type === "init") {
      try {
        bank = await VoiceBank.load(msg.koe);
        worldline = msg.lightweight ? null : await Worldline.load({ scriptUrl: msg.worldlineScriptUrl }).catch(
          () => null
        );
        wself.postMessage({
          type: "ready",
          aliases: Object.keys(bank.manifest.phonemes),
          phonemes: bank.manifest.phonemes
        });
      } catch (err) {
        wself.postMessage({
          type: "error",
          message: String(err?.message ?? err)
        });
      }
      return;
    }
    if (msg.type === "render") {
      const {
        id,
        alias,
        pitch,
        durationMs,
        vibrato,
        gender,
        breathiness,
        tension,
        pitchSegments
      } = msg;
      try {
        const out = await renderAlias(
          alias,
          pitch,
          durationMs,
          vibrato,
          gender,
          breathiness,
          tension,
          pitchSegments
        );
        if (out) {
          wself.postMessage(
            {
              type: "rendered",
              id,
              pcm: out.pcm,
              preSec: out.preSec,
              rate: out.rate
            },
            [out.pcm.buffer]
          );
        } else {
          wself.postMessage({ type: "rendered", id, pcm: null });
        }
      } catch {
        wself.postMessage({ type: "rendered", id, pcm: null });
      }
      return;
    }
    if (msg.type === "speak-abort") {
      speechAborts.get(msg.id)?.abort();
      return;
    }
    if (msg.type === "pcm") {
      const { id, alias } = msg;
      try {
        const raw = bank ? await getPcm(alias) : null;
        if (raw) {
          const pcm = Float32Array.from(raw);
          wself.postMessage({ type: "pcm", id, pcm }, [pcm.buffer]);
        } else {
          wself.postMessage({ type: "pcm", id, pcm: null });
        }
      } catch {
        wself.postMessage({ type: "pcm", id, pcm: null });
      }
      return;
    }
    if (msg.type === "speak") {
      const { id, plan, gender, breathiness, tension, energyDbPerSemitone } = msg;
      if (!bank || !worldline) {
        wself.postMessage({
          type: "speech-end",
          id,
          error: "speech needs worldline (not available in lightweight mode)"
        });
        return;
      }
      const abort = new AbortController();
      speechAborts.set(id, abort);
      try {
        speechAdapter ??= new UtauTTSAdapter(worldline);
        prefetchSpeechPcm(plan, getPcm);
        const view = speechBankView(bank, getPcm);
        for await (const chunk of speechAdapter.renderChunks(view, plan, {
          signal: abort.signal,
          gender,
          breathiness,
          tension,
          energyDbPerSemitone
        })) {
          wself.postMessage(
            {
              type: "speech-chunk",
              id,
              pcm: chunk.pcm,
              startMs: chunk.startMs,
              index: chunk.index
            },
            [chunk.pcm.buffer]
          );
        }
        wself.postMessage({ type: "speech-end", id });
      } catch (err) {
        wself.postMessage({
          type: "speech-end",
          id,
          error: String(err?.message ?? err)
        });
      } finally {
        speechAborts.delete(id);
      }
    }
  };
})();
