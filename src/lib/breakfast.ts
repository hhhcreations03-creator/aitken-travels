/**
 * The complimentary breakfast menu, as printed by the hotel (Nov 2026).
 * Every breakfast is cooked to order and comes with a seasonal fruit platter,
 * one fresh drink, and Ceylon tea or black coffee.
 */
export interface Dish {
  name: string;
  note: string;
}

export interface Course {
  title: string;
  dishes: Dish[];
}

export const BREAKFAST: Course[] = [
  {
    title: "Fresh & light",
    dishes: [
      { name: "Tropical smoothie bowl", note: "Banana, mango and pineapple, topped with fresh tropical fruit and mixed seeds." },
      { name: "Overnight oats", note: "Slow-soaked oats with banana, cinnamon and seasonal fruit." },
      { name: "Hummus toast", note: "Whole-grain toast with creamy hummus, crumbled feta, mixed seeds and microgreens." },
    ],
  },
  {
    title: "Sri Lankan favourites",
    dishes: [
      { name: "Coconut roti & island relishes", note: "Fresh coconut roti with creamy dhal curry, caramelised onion sambol and house-made tomato relish." },
      { name: "Avocado hoppers", note: "Traditional egg hoppers with smashed avocado, fresh herbs and a squeeze of lime." },
    ],
  },
  {
    title: "Indian options",
    dishes: [
      { name: "Dosa with sambar & coconut chutney", note: "Crisp dosa with flavourful sambar and fresh coconut chutney." },
      { name: "Chapati with butter chicken", note: "Soft chapati with creamy butter chicken." },
    ],
  },
  {
    title: "Wholesome & energising",
    dishes: [
      { name: "Grilled chicken & quinoa bowl", note: "Grilled chicken with quinoa, seasonal vegetables and a light house dressing." },
      { name: "Avocado & egg sourdough toast", note: "Sourdough with smashed avocado, eggs as you like them, herbs and cracked black pepper." },
    ],
  },
  {
    title: "Eggs & classics",
    dishes: [
      { name: "Eggs with caramelised onion & mushrooms", note: "Eggs as you like them, with caramelised onion, sautéed mushrooms and toasted brown bread." },
      { name: "Creamy scrambled eggs", note: "Soft, buttery scrambled eggs on toast with fresh herbs." },
      { name: "Garden omelette", note: "A fluffy omelette filled with seasonal vegetables and fresh herbs." },
      { name: "Shakshuka", note: "Eggs poached in a spiced tomato and sweet pepper sauce, with crusty bread." },
    ],
  },
  {
    title: "Sweet morning",
    dishes: [
      { name: "Coconut & banana pancakes", note: "Fluffy pancakes with coconut and banana, finished with kithul treacle." },
      { name: "French toast with Sri Lankan strawberries", note: "Golden French toast with fresh Sri Lankan strawberries and a drizzle of honey." },
    ],
  },
  {
    title: "The full English",
    dishes: [
      { name: "Full English breakfast", note: "Eggs as you like them, crispy bacon, breakfast sausages, toast, roasted tomatoes, golden fried potatoes and sautéed mushrooms." },
    ],
  },
];

export const BREAKFAST_DISH_COUNT = BREAKFAST.reduce((n, c) => n + c.dishes.length, 0);

/** What comes with every breakfast. */
export const WITH_EVERY_BREAKFAST = [
  { title: "Seasonal fruit platter", note: "Freshly cut tropical fruit, with every breakfast." },
  { title: "One fresh drink", note: "Freshly squeezed seasonal juice or a king coconut." },
  { title: "Tea or coffee", note: "Ceylon tea or freshly brewed black coffee." },
];
