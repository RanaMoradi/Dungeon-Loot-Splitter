// ============================================================
// APPLICATION STATE
// The loot array and partySize are the single source of truth.
// They are declared at the top of the file, outside any function,
// so they persist across every event and every call to updateUI().
// ============================================================
const loot = [];
let partySize = 0;

// ============================================================
// EVENT LISTENERS
// No inline handlers anywhere in the HTML. Every interaction
// is wired up here so all logic lives in this one file.
// ============================================================
document.getElementById("add-loot-btn").addEventListener("click", function ()
{
    addLoot();
});

document.getElementById("split-loot-btn").addEventListener("click", function ()
{
    // The Split button does not calculate anything itself.
    // It only asks updateUI() to recompute and re-render from
    // current state, which is the architectural rule for this phase.
    updateUI();
});

document.getElementById("party-size").addEventListener("input", function ()
{
    // Changing party size is a state change, so it must trigger
    // updateUI() immediately rather than waiting for a button click.
    partySize = parseInt(document.getElementById("party-size").value);
    updateUI();
});


// ============================================================
// addLoot()
// Validates the new item BEFORE it is allowed to enter the
// array. Invalid data must never become part of application state.
// ============================================================
function addLoot()
{
    document.getElementById("loot-error").innerHTML = "";

    const lootName     = document.getElementById("loot-name").value.trim();
    const lootValue     = parseFloat(document.getElementById("loot-value").value);
    const lootQuantity = parseInt(document.getElementById("loot-quantity").value);

    // Validate name
    if (lootName === "")
    {
        document.getElementById("loot-error").innerHTML = "Please enter a loot name.";
        return;
    }

    // Validate value
    if (isNaN(lootValue) || lootValue < 0)
    {
        document.getElementById("loot-error").innerHTML = "Please enter a valid, non-negative loot value.";
        return;
    }

    // Validate quantity
    if (isNaN(lootQuantity) || lootQuantity < 1)
    {
        document.getElementById("loot-error").innerHTML = "Quantity must be 1 or greater.";
        return;
    }

    // Only after validation passes do we mutate state.
    // Plain object literal - no classes, per requirements.
    const newLoot = {
        name:     lootName,
        value:    lootValue,
        quantity: lootQuantity
    };

    loot.push(newLoot);

    // Clear the inputs for the next entry
    document.getElementById("loot-name").value     = "";
    document.getElementById("loot-value").value     = "";
    document.getElementById("loot-quantity").value = "";

    // State changed, so the interface must be told to reflect it.
    updateUI();
}


// ============================================================
// removeLoot(index)
// Removes a single item from the loot array using splice(),
// then immediately re-renders through updateUI(). This function
// does not calculate totals itself - that is updateUI()'s job.
// ============================================================
function removeLoot(index)
{
    loot.splice(index, 1);
    updateUI();
}


// ============================================================
// updateUI()
// The ONLY function that calculates totals, renders the loot
// list, calculates the split, and enables/disables/shows/hides
// interface elements. This keeps all logic in one predictable
// place instead of scattering calculations across button handlers.
// ============================================================
function updateUI()
{
    // ---- 1. Calculate total loot using a traditional for loop ----
    // Total for each item is value * quantity, summed across the array.
    let totalLoot = 0;

    for (let i = 0; i < loot.length; i++)
    {
        totalLoot += loot[i].value * loot[i].quantity;
    }

    // ---- 2. Render the loot list dynamically ----
    let lootRows = document.getElementById("lootRows");
    lootRows.innerHTML = "";

    const noLootMessage = document.getElementById("noLootMessage");
    const lootTable      = document.getElementById("lootTable");

    if (loot.length === 0)
    {
        // Empty state: show message, hide the table headers/rows
        noLootMessage.classList.remove("hidden");
        lootTable.classList.add("hidden");
    }
    else
    {
        noLootMessage.classList.add("hidden");
        lootTable.classList.remove("hidden");

        for (let i = 0; i < loot.length; i++)
        {
            let row = document.createElement("div");
            row.className = "loot-row";

            let nameCell = document.createElement("div");
            nameCell.className = "loot-cell";
            nameCell.innerText = loot[i].name;

            let valueCell = document.createElement("div");
            valueCell.className = "loot-cell";
            valueCell.innerText = loot[i].value.toFixed(2);

            let quantityCell = document.createElement("div");
            quantityCell.className = "loot-cell";
            quantityCell.innerText = loot[i].quantity;

            let actionCell = document.createElement("div");
            actionCell.className = "loot-cell loot-actions";

            let removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.innerText = "Remove";

            // Capture the current index so the correct item is removed,
            // even after the array changes on future renders.
            removeBtn.addEventListener("click", function ()
            {
                removeLoot(i);
            });

            actionCell.appendChild(removeBtn);

            row.appendChild(nameCell);
            row.appendChild(valueCell);
            row.appendChild(quantityCell);
            row.appendChild(actionCell);

            lootRows.appendChild(row);
        }
    }

    // Update the running total display
    document.getElementById("totalLoot").innerText = totalLoot.toFixed(2);

    // ---- 3. Calculate split ----
    const partySizeValid = !isNaN(partySize) && partySize >= 1;
    const lootValid       = loot.length > 0;
    const stateIsValid     = partySizeValid && lootValid;

    let perMember = 0;

    if (stateIsValid)
    {
        perMember = totalLoot / partySize;
    }

    // ---- 4. Enable/disable Split button using the disabled attribute ----
    const splitBtn = document.getElementById("split-loot-btn");
    splitBtn.disabled = !stateIsValid;

    // ---- 5. Show/hide results using the hidden class, never inline styles ----
    const resultsDiv = document.getElementById("split-results");

    if (stateIsValid)
    {
        resultsDiv.classList.remove("hidden");
        document.getElementById("total-loot-display").innerText =
            "Total Loot: $" + totalLoot.toFixed(2);
        document.getElementById("per-member-display").innerText =
            "Loot Per Party Member: $" + perMember.toFixed(2);
    }
    else
    {
        resultsDiv.classList.add("hidden");
    }

    // Show a party size error message when the input has a value but it's invalid
    const partySizeInput = document.getElementById("party-size");

    if (partySizeInput.value !== "" && !partySizeValid)
    {
        document.getElementById("party-error").innerHTML =
            "Party size must be 1 or greater.";
    }
    else
    {
        document.getElementById("party-error").innerHTML = "";
    }
}


// ============================================================
// Initial render on page load so the empty state and disabled
// Split button are correct before any user interaction occurs.
// ============================================================
updateUI();