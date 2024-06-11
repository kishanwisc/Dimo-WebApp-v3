document.addEventListener('DOMContentLoaded', () => {
    const carDataDiv = document.getElementById('carData');
    const tokenInput = document.getElementById('tokenInput');
    const getCarDataButton = document.getElementById('getCarDataButton');
    const shareTwitterButton = document.getElementById('shareTwitterButton');

    let carData = null;

    const fetchCarData = async (tokenId) => {
        try {
            console.log('Fetching data for Token ID:', tokenId);  // Log the Token ID being fetched
            const response = await fetch('/fetchCarData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tokenId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                carDataDiv.innerHTML = `<p>Error: ${errorText}</p>`;
                return;
            }

            carData = await response.json();

            // Check for null values before accessing properties
            carDataDiv.innerHTML = `
                <h2>Car Data</h2>
                <p><strong>ID:</strong> ${carData.id}</p>
                <p><strong>Name:</strong> ${carData.name}</p>
                <p><strong>DCN Name:</strong> ${carData.dcn ? carData.dcn.name : 'N/A'}</p>
                <p><strong>Make:</strong> ${carData.definition ? carData.definition.make : 'N/A'}</p>
                <p><strong>Model:</strong> ${carData.definition ? carData.definition.model : 'N/A'}</p>
                <p><strong>Year:</strong> ${carData.definition ? carData.definition.year : 'N/A'}</p>
            `;
        } catch (error) {
            carDataDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        }
    };

    const shareOnTwitter = () => {
        if (!carData) {
            console.error("No car data available to share.");
            return;
        }

        const url = window.location.href;
        const text = encodeURIComponent(`Check out this car data: ID ${carData.id}, Make ${carData.definition.make}, Model ${carData.definition.model}, Year ${carData.definition.year}`);
        const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        window.open(twitterUrl, '_blank');
    };

    getCarDataButton.addEventListener('click', () => {
        const tokenId = tokenInput.value;
        if (tokenId) {
            fetchCarData(tokenId);
            window.history.pushState({}, '', `/token/${tokenId}`);
        }
    });

    shareTwitterButton.addEventListener('click', () => {
        shareOnTwitter();
    });

    // Check if there's a tokenId in the URL
    const tokenId = window.location.pathname.split('/').pop();
    if (tokenId && tokenId !== 'token') {
        tokenInput.value = tokenId;
        fetchCarData(tokenId);
    }
});
