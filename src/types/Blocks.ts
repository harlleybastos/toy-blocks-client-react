export interface ShapeBlock {
  data: ShapeBlockData[];
  url?: string;
  isLoading?: boolean;
  isError?: boolean;
}

export interface ShapeBlockData {
  id: string;
  type: string;
  attributes: ShapeAttributes;
}

export interface ShapeAttributes {
  index: number;
  timestamp: number;
  data: string;
  "previous-hash": string;
  hash: string;
}
