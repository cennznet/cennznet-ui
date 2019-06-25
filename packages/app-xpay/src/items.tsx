const items = [
  {
    text: '100: Coke',
    value: 100,
    name: 'Coke'
  },
  {
    text: '101: Lemonade',
    value: 101,
    name: 'Lemonade'
  },
  {
    text: '102: Coffee',
    value: 102,
    name: 'Coffee'
  },
  {
    text: '200: Chips',
    value: 200,
    name: 'Chips'
  },
  {
    text: '201: Cookies',
    value: 201,
    name: 'Cookies'
  }
];

export const itemsById = items.reduce((acc, item) => {
  acc[item.value] = item;
  return acc;
}, {} as { [key: string]: typeof items[0] });

export default items;
