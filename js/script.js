// Array to store loot items - declared outside functions so it persists across button clicks
const lootItems = [];

// Register event listeners
document.getElementById("add-loot-btn").addEventListener("click", function()
{
    addLoot();
});

document.getElementById("split-loot-btn").addEventListener("click", function()
{
    splitLoot();
});

// addLoot() - validates inputs and adds a loot object to the array
function addLoot()
{
    // Clear previous error messages
    document.getElementById("loot-error").innerHTML = "";

    // Get input values
    const lootName  = document.getElementById("loot-name").value.trim();
    const lootValue = parseFloat(document.getElementById("loot-value").value);

    // Validate: loot name must not be empty
    if (lootName === "")
    {
        document.getElementById("loot-error").innerHTML = "Please enter a loot name.";
        return;
    }

    // Validate: loot value must be a valid number
    if (isNaN(lootValue))
    {
        document.getElementById("loot-error").innerHTML = "Please enter a valid loot value.";
        return;
    }

    // Validate: loot value must not be negative
    if (lootValue < 0)
    {
        document.getElementById("loot-error").innerHTML = "Loot value cannot be negative.";
        return;
    }

    // Create loot object and push into array
    const newLoot = {
        name:  lootName,
        value: lootValue
    };

    lootItems.push(newLoot);

    // Clear inputs after successful add
    document.getElementById("loot-name").value  = "";
    document.getElementById("loot-value").value = "";

    // Re-render the loot list
    renderLoot();
}

// renderLoot() - loops through lootItems array and updates the DOM
function renderLoot()
{
    const lootList = document.getElementById("loot-list");

    // Clear current list
    lootList.innerHTML = "";

    // If array is empty, show placeholder message
    if (lootItems.length === 0)
    {
        lootList.innerHTML = "<li class='empty-msg'>No loot added yet.</li>";
        document.getElementById("running-total").innerHTML = "Total Loot: $0.00";
        return;
    }

    // Loop through array to build list and calculate running total
    let runningTotal = 0;

    for (let i = 0; i < lootItems.length; i++)
    {
        // Create list item
        const listItem = document.createElement("li");
        listItem.innerHTML =
            "<span>" + lootItems[i].name + "</span>" +
            "<span>$" + lootItems[i].value.toFixed(2) + "</span>";

        lootList.appendChild(listItem);

        // Accumulate total
        runningTotal += lootItems[i].value;
    }

    // Update running total display
    document.getElementById("running-total").innerHTML =
        "Total Loot: $" + runningTotal.toFixed(2);
}

// splitLoot() - divides total loot evenly among party members
function splitLoot()
{
    // Clear previous results and errors
    document.getElementById("split-error").innerHTML        = "";
    document.getElementById("total-loot-display").innerHTML = "";
    document.getElementById("per-member-display").innerHTML = "";
    document.getElementById("party-error").innerHTML        = "";

    // Get party size
    const partySize = parseInt(document.getElementById("party-size").value);

    // Validate: party size must be 1 or greater
    if (isNaN(partySize) || partySize < 1)
    {
        document.getElementById("party-error").innerHTML =
            "Please enter a party size of 1 or greater.";
        return;
    }

    // Validate: there must be loot to split
    if (lootItems.length === 0)
    {
        document.getElementById("split-error").innerHTML =
            "No loot to split. Add some loot first.";
        return;
    }

    // Calculate total using a loop
    let total = 0;

    for (let i = 0; i < lootItems.length; i++)
    {
        total += lootItems[i].value;
    }

    // Calculate per member share
    const perMember = total / partySize;

    // Display results
    document.getElementById("total-loot-display").innerHTML =
        "Total Loot: $" + total.toFixed(2);

    document.getElementById("per-member-display").innerHTML =
        "Loot Per Party Member: $" + perMember.toFixed(2);
}