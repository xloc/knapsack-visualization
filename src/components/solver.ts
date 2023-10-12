import { maxBy } from "lodash";
import { KnapsackItem, Solution, CellProfit } from "./types";
import _ from "lodash";

export const solveKnapsack = (items: KnapsackItem[], weightLimit: number): Solution => {
  const nRow = items.length + 1;
  const nCol = weightLimit + 1;
  const table: CellProfit[][] = [];

  table.push(Array<CellProfit>(nCol).fill({ maxProfit: 0 }));

  for (const iItem of _.range(1, nRow)) {
    const row: CellProfit[] = [];
    table.push(row);
    for (const currWeight of _.range(nCol)) {
      if (currWeight === 0) {
        row.push({ maxProfit: 0 });
      } else {
        const item = items[iItem - 1];
        if (currWeight - item.weight >= 0) {
          const result = maxBy([
            { maxProfit: table[iItem - 1][currWeight].maxProfit, from: [iItem - 1, currWeight] },
            { maxProfit: item.profit + table[iItem - 1][currWeight - item.weight].maxProfit, from: [iItem - 1, currWeight - item.weight] }
          ] as CellProfit[], "maxProfit")!;
          row.push(result);
        } else {
          row.push({
            maxProfit: table[iItem - 1][currWeight].maxProfit,
            from: [iItem - 1, currWeight]
          });
        }
      }
    }
  }

  const maxProfit = table[nRow - 1][nCol - 1].maxProfit;
  return { nRow, nCol, table, maxProfit };
};