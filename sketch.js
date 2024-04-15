let ingredientsList = []; // Initialize array to store generated ingredients
let generateButton; // Declare button variable
let budgetSlider; // Declare slider variable
let minBudget = 10; // Minimum budget value (in dollars)
let maxBudget = 50; // Maximum budget value (in dollars)
let trackedIngredient = ''; // Initialize variable to track a specific ingredient
let previousIngredients = []; // Array to store previous generation's ingredients

// Define a mapping of ingredients to their fixed prices
const ingredientPrices = {
  'Tomatoes': 2.50,
  'Cheese': 3.00,
  'Chicken': 5.00,
  'Lettuce': 1.50,
  'Onions': 1.00,
  'Garlic': 1.20,
  'Rice': 2.00,
  'Pasta': 2.50,
  'Olive Oil': 4.00,
  'Basil': 2.00,
  'Eggs': 3.50,
  'Mushrooms': 3.00,
  'Bell Peppers': 2.00,
  'Avocado': 3.50,
  'Soy Sauce': 1.80,
  'Bread': 2.00,
  'Tortilla': 1.50,
  'Potato': 1.80,
  'Quinoa': 4.00
};

function setup() {
  createCanvas(600, 500); // Adjusted canvas height to accommodate additional text
  background(255);

  // Create text displays for budget range
  textSize(14);
  fill(0);
  textAlign(LEFT);
  text(`Min Budget: $${minBudget}`, 20, height - 30);
  text(`Max Budget: $${maxBudget}`, width - 120, height - 30);

  // Create a budget slider
  budgetSlider = createSlider(minBudget, maxBudget, (minBudget + maxBudget) / 2, 5); // Default value: midpoint of min and max
  budgetSlider.position(20, height - 50);

  // Create a button to generate random ingredients
  generateButton = createButton('Generate Ingredients');
  generateButton.position(180, height - 50);
  generateButton.mousePressed(generateRandomIngredients);
}

function generateRandomIngredients() {
  const maxBudget = budgetSlider.value(); // Get the current value of the budget slider

  let totalCost = 0; // Initialize total cost
  let hasStarch = false; // Flag to track if at least one starch is included

  // Store current list of ingredients as previous
  previousIngredients = ingredientsList.slice();

  ingredientsList = []; // Clear current list of ingredients

  // Generation 1: Generate random ingredients without any constraints
  while (totalCost <= maxBudget) {
    const newIngredient = getRandomIngredient();
    const newIngredientCost = ingredientPrices[newIngredient];

    // Check if adding the new ingredient exceeds the budget
    if (totalCost + newIngredientCost > maxBudget) {
      break; // Stop adding ingredients if budget limit is reached
    }

    // Add the new random ingredient to the list
    addIngredientToShoppingList(newIngredient);
    totalCost += newIngredientCost; // Update total cost

    // Check if at least one starch is included in the list
    if (!hasStarch) {
      hasStarch = isStarch(newIngredient);
    }
  }

  // Generation 2: Carry over one ingredient from Generation 1
  if (previousIngredients.length > 0) {
    const sharedIngredient = random(previousIngredients); // Pick a random ingredient from Generation 1
    addIngredientToShoppingList(sharedIngredient); // Add the shared ingredient to Generation 2
    totalCost += ingredientPrices[sharedIngredient]; // Update total cost
    trackedIngredient = sharedIngredient; // Track the specific shared ingredient
  }

  // Adjust ingredients to stay within the budget (excluding shared ingredient removal)
  while (totalCost > maxBudget && ingredientsList.length > 1) {
    // Remove a non-starch ingredient (excluding the shared ingredient) to stay within the budget
    const nonStarchIngredients = ingredientsList.filter((ingredient) => !isStarch(ingredient) && ingredient !== trackedIngredient);
    if (nonStarchIngredients.length > 0) {
      const ingredientToRemove = random(nonStarchIngredients);
      const ingredientCost = ingredientPrices[ingredientToRemove];
      ingredientsList = ingredientsList.filter((ingredient) => ingredient !== ingredientToRemove); // Remove ingredient
      totalCost -= ingredientCost; // Update total cost
    }
  }

  // Display generated ingredients on canvas
  displayIngredients(totalCost);
}

function isStarch(ingredient) {
  // Define a list of starch-based ingredients
  const starchIngredients = ['Bread', 'Tortilla', 'Pasta', 'Rice', 'Potato', 'Quinoa']; // Add more if needed

  // Check if the ingredient is in the list of starch ingredients
  return starchIngredients.includes(ingredient);
}

function displayIngredients(totalCost) {
  background(255); // Clear canvas
  textSize(16);
  textAlign(LEFT);

  let yPos = 40;

  // Calculate total cost based on displayed ingredients
  const uniqueIngredients = Array.from(new Set(ingredientsList)); // Get unique ingredients

  // Determine dish title based on ingredients
  const dishTitle = generateDishTitle(uniqueIngredients);

  // Display dish title at the top
  fill(0); // Set fill color to black
  textStyle(BOLD); // Set font style to bold for dish title
  text(`${dishTitle}`, 20, yPos);
  yPos += 30;

  // Display headers for ingredients and prices columns
  textStyle(BOLD); // Set font style to bold for headers
  text('Generated Ingredients:', 20, yPos);
  text('Price (per unit):', 300, yPos);
  yPos += 30;
  textStyle(NORMAL); // Reset font style to normal

  // Display generated ingredients
  uniqueIngredients.forEach((ingredient) => {
    const count = ingredientsList.filter((item) => item === ingredient).length;
    const pricePerUnit = ingredientPrices[ingredient]; // Get fixed price per unit from mapping
    const totalPriceForIngredient = count * pricePerUnit; // Calculate total price for this ingredient

    // Display ingredient and total price
    text(`${count} ${ingredient}`, 20, yPos);
    text(`$${totalPriceForIngredient.toFixed(2)}`, 300, yPos);

    yPos += 20; // Move to the next line
  });

  // Display total cost at the bottom
  textStyle(BOLD); // Set font style to bold for total cost
  text('Total Cost:', 20, yPos);
  text(`$${totalCost.toFixed(2)}`, 300, yPos);

  // Display shared ingredient from previous generation below total cost
  yPos += 30;
  text('Shared Ingredient from Previous Generation:', 20, yPos);
  text(`${trackedIngredient}`, 20, yPos + 20);
}

function addIngredientToShoppingList(ingredient) {
  ingredientsList.push(ingredient);
}

function getRandomIngredient() {
  // List of possible ingredients
  const possibleIngredients = Object.keys(ingredientPrices);

  // Select a random ingredient from the list
  const randomIndex = floor(random(possibleIngredients.length));
  return possibleIngredients[randomIndex];
}

function generateDishTitle(ingredients) {
  // Create a descriptive dish title based on included ingredients
  const titleWords = [];
  
  // Generate random adjectives and nouns for a creative dish name
  const adjectives = ['Zesty', 'Savory', 'Spicy', 'Mouthwatering', 'Exotic', 'Wholesome', 'Gourmet', 'Hearty', 'Fusion', 'Delicious'];
  const nouns = ['Delight', 'Medley', 'Creation', 'Feast', 'Harvest', 'Bowl', 'Platter', 'Bounty', 'Blend', 'Extravaganza'];

  // Shuffle the arrays to add variety to the dish name
  shuffleArray(adjectives);
  shuffleArray(nouns);

  // Choose a random number of adjectives (1 to 2) for the dish title
  const numAdjectives = random(1, 3);

  // Select random adjectives and append to the title words
  for (let i = 0; i < numAdjectives; i++) {
    titleWords.push(adjectives[i]);
  }

  // Select a random noun for the dish title
  titleWords.push(nouns[0]);

  // Capitalize the first letter of each word and join them with a space
  return titleWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function shuffleArray(array) {
  // Function to shuffle an array using the Fisher-Yates algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
