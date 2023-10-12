export interface KnapsackItem {
  profit: number;
  weight: number;
}

export interface Input {
  items: KnapsackItem[];
  weightLimit: number;
}


export interface CellProfit {
  maxProfit: number;
  from?: [number, number];
}

export interface Solution {
  nRow: number;
  nCol: number;
  // rows: max profits if only consider the first n_row items
  // cols: the max profit if the weight limit is n_col
  table: CellProfit[][];
  maxProfit: number;
}