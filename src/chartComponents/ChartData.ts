
export type DrillDataType = {
  category: string;
  value: number;
  children?: DrillDataType[];
};

export const barData: DrillDataType[] = [
  {
    category: "Fruits",
    value: 60,
    children: [
      { category: "Apples", value: 25 },
      { category: "Oranges", value: 20 },
      { category: "Bananas", value: 15 }
    ]
  },
  {
    category: "Vegetables",
    value: 40,
    children: [
      { category: "Tomatoes", value: 15 },
      { category: "Potatoes", value: 15 },
      { category: "Cucumbers", value: 10 }
    ]
  },
  {
    category: "Grains",
    value: 30,
    children: [
      { category: "Rice", value: 20 },
      { category: "Wheat", value: 10 }
    ]
  }
];
