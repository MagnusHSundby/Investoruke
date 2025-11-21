let data = []
async function fetchData() {
    try {
        const response = await fetch("data/motivasjonMeldinger.json")

        if (!response.ok) throw new Error(`Response ${response.status}`);

        data = await response.json();
    } catch (error) {
        console.log("Fetch error:", error.message);
    }
    // console.log(data.motivational_messages.happy[0])
    chooseMessage("happy");
};

function chooseMessage(category) {
    let count = data.motivational_messages[category].length;
    let randomIndex = Math.floor(Math.random() * count)

    let messages = data.motivational_messages[category][randomIndex]

    console.log("Count:", count);
    console.log("Random index:", randomIndex);
    console.log("Random message:", messages);
};


setInterval(() => {
    fetchData()
}, 3000);
