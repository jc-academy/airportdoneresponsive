const AIR_API = "339ebf6b-66df-48a0-ae81-faee093d040f"
/*
Mos e beni kete ne nje webfaqe publike, pasiqe API KEY do mund te
behet leak. Kjo shkon ne nje .env file ne backend
*/

const returnBtn = document.getElementById("typeReturn");
const onewayBtn = document.getElementById("typeOneWay");
const endSection = document.getElementById("endSection");
const endDate = document.getElementById("endDate");

function toggleTripType(){

    if(onewayBtn.checked){

        endSection.style.display = "none";
        endDate.required = false;

    }else{
        endSection.style.display = "flex";
        endDate.required = true;
    }
}

returnBtn.addEventListener("change", toggleTripType);
onewayBtn.addEventListener("change", toggleTripType);

toggleTripType();

const fromInput = document.getElementById("from");
const toInput = document.getElementById("to");

const fromSuggestions = document.getElementById("fromSuggestions");
const toSuggestions = document.getElementById("toSuggestions");

async function searchAirport(query, suggestionBox, inputElement) {

    if(query.length < 2){
        suggestionBox.innerHTML = "";
        return;
    }

    try{

        const response = await fetch(
            `https://airlabs.co/api/v9/airports?search=${query}&api_key=${AIR_API}`
        );

        const data = await response.json();

        suggestionBox.innerHTML = "";

        const filteredAirports = data.response
                .filter(airport => {

                    const search = query.toLowerCase();

                    return (
                        airport.name?.toLowerCase().includes(search) ||
                        airport.city?.toLowerCase().includes(search) ||
                        airport.iata_code?.toLowerCase().includes(search)
                    );
                })
                .sort((a, b) => {

                    const search = query.toLowerCase();

                    const aStarts =
                        a.name?.toLowerCase().startsWith(search) ||
                        a.city?.toLowerCase().startsWith(search);

                    const bStarts =
                        b.name?.toLowerCase().startsWith(search) ||
                        b.city?.toLowerCase().startsWith(search);

                    return bStarts - aStarts;
                })
                .slice(0, 8);

            filteredAirports.forEach(airport => {

            const div = document.createElement("div");

            div.textContent =
                `${airport.name} (${airport.iata_code}) - ${airport.city || "Unknown City"}`;;

            div.addEventListener("click", () => {

                inputElement.value =
                    `${airport.name} (${airport.iata_code})`;

                suggestionBox.innerHTML = "";
            });

            suggestionBox.appendChild(div);
        });

    }catch(error){
        console.log("Error fetching airports:", error);
    }
}

fromInput.addEventListener("input", () => {
    searchAirport(
        fromInput.value,
        fromSuggestions,
        fromInput
    );
});

toInput.addEventListener("input", () => {
    searchAirport(
        toInput.value,
        toSuggestions,
        toInput
    );
});

document.addEventListener("click", (e) => {

    if(!e.target.closest(".autocomplete")){
        fromSuggestions.innerHTML = "";
        toSuggestions.innerHTML = "";
    }
});

const form = document.getElementById("ticketForm");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    alert("Searching for tickets...");

    form.reset();

    fromSuggestions.innerHTML = "";
    toSuggestions.innerHTML = "";

    toggleTripType();
});