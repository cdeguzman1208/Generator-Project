let previousIngredients = []; // Initialize empty list for previous ingredients
let regenerateButton; // Declare button variable

function getRandomInt(min, max) { 
  min = Math.ceil(min); 
  max = Math.floor(max); 
  return Math.floor(Math.random() * (max - min + 1)) + min; 
} 
 
// Example usage 
var randomNum = getRandomInt(1, 10); 

function setup() {
  createCanvas(400, 400);
  background(255);

  // Define user preferences (adjust as needed)
  const userPreferences = {
    includeIngredients: ['Tomatoes', 'Cheese', 'Chicken'],
    budget: 15,
    foodCategory: 'Italian'
  };

  // Generate the first grocery list (initial generation)
  generateAndDisplayGroceryList(userPreferences);

  // Create a button to regenerate the grocery list
  regenerateButton = createButton('Generate Next List');
  regenerateButton.position(20, height - 50);
  regenerateButton.mousePressed(regenerateGroceryList);
}

function generateAndDisplayGroceryList(preferences) {
  const generatedIngredients = generateGroceryList(preferences);
  displayIngredients(generatedIngredients);
}

function displayIngredients(ingredients) {
  background(255); // Clear canvas
  textSize(16);
  fill(0);
  textAlign(LEFT);

  let yPos = 40;

  // Display header
  text('Ingredients:', 20, yPos);
  yPos += 30;

  // Display each ingredient
  ingredients.forEach((ingredient, index) => {
    text(`${index + 1}. ${ingredient}`, 40, yPos);
    yPos += 20;
  });
}

function generateGroceryList(preferences) {
  const { includeIngredients, budget, foodCategory } = preferences;

  // Define ingredient lists for different food categories
  const ingredientLists = {
    Italian: ['Tomatoes', 'Basil', 'Garlic', 'Parmesan Cheese', 'Olive Oil', 'Pasta'],
    Mexican: ['Avocado', 'Salsa', 'Cilantro', 'Lime', 'Tortillas', 'Black Beans'],
    Indian: ['Curry Powder', 'Cumin', 'Ginger', 'Garlic', 'Basmati Rice', 'Naan Bread'],
    American: ['Chicken', 'Beef', 'Bacon', 'Lettuce', 'Cheddar Cheese', 'Burger Buns']
    // Add more food categories and ingredient lists as needed
  };

  // Select ingredients based on user preferences and food category
  let ingredients = ingredientLists[foodCategory] || []; // Default to empty array if category not found

  // Include starch ingredient(s) in the recipe
  const starchIngredients = ['Bread', 'Rice', 'Pasta', 'Potatoes', 'Tortillas'];
  const randomStarch = starchIngredients[Math.floor(Math.random() * starchIngredients.length)];
  ingredients.push(randomStarch);

  // Filter ingredients based on user-selected preferences (includeIngredients)
  ingredients = ingredients.filter(ingredient => includeIngredients.includes(ingredient));

  // Calculate cost for each ingredient (dummy cost calculation based on random prices)
  const ingredientCosts = {};
  ingredients.forEach(ingredient => {
    ingredientCosts[ingredient] = Math.random() * 5 + 1; // Generate random cost between $1 and $6
  });

  // Filter out ingredients that exceed the budget
  const affordableIngredients = ingredients.filter(ingredient => ingredientCosts[ingredient] <= budget);

  // Ensure generated recipe includes at least 1 starch and costs more than $0
  if (affordableIngredients.length > 0) {
    return affordableIngredients;
  } else {
    console.log('No affordable ingredients found. Please adjust your preferences.');
    return [];
  }
}

function regenerateGroceryList() {
  // Define user preferences (adjust as needed)
  const userPreferences = {
    includeIngredients: ['Tomatoes', 'Cheese', 'Chicken'],
    budget: 15,
    foodCategory: 'Italian'
  };

  // Generate and display the next grocery list
  generateAndDisplayGroceryList(userPreferences);
}
