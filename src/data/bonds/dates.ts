// おでかけ（デート）：1人1本。src/data/bonds/dates/<id>.ts に分けて書く。
import type { DateDef } from "../../engine/defs";
import { date as feris } from "./dates/feris";
import { date as nanj } from "./dates/nanj";
import { date as roze } from "./dates/roze";
import { date as teto } from "./dates/teto";

export const dates: DateDef[] = [roze, feris, teto, nanj].filter(
	(d): d is DateDef => !!d,
);
