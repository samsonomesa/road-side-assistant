window.addEventListener('DOMContentLoaded', event => {
    try {

        let app = firebase.app();

        let features = ['auth', 'firestore'].filter(feature => typeof app[feature] === 'function');

        console.log(`Firebase SDK loaded with ${features.join(', ')}`)

        firebase.auth().onAuthStateChanged(user => {
            if (user) {

                showDashboard()
                hideLoader()
                console.log('Show dashboard')

            } else {
                //Redirect to index for login
                window.location.href = "/index.html"
            }

        })

        // Logging out the currently authenticated user
        document.querySelector('#logout-btn').addEventListener('click', event => {

            firebase.auth().signOut().then(e => {
                console.log(e)
            }, error => {
                console.log(error)
            });

        })

        document.querySelectorAll('.view-message').forEach(btn => {
            btn.addEventListener('click', event => {
                console.log(event.target)
            })
        })

        //Firestore Database Instance
        const db = firebase.firestore()

        console.log("Hello");

        db.collection("messages")
            .onSnapshot(querySnapshot => {

                let messages = []

                querySnapshot.forEach(doc => {

                    const {
                        carModel,
                        carPlateNumber,
                        locationName,
                        description
                    } = doc.data()

                    messages.push({
                        "id": doc.id,
                        carModel,
                        carPlateNumber,
                        locationName,
                        description
                    })

                    console.table(messages)

                    let tableData = ''

                    messages.forEach((message, index) => {
                        tableData += `
                        <tr>
                            <td>${++index}</td>
                            <td class="mdl-data-table__cell--non-numeric">${message.carModel}</td>
                            <td class="mdl-data-table__cell--non-numeric">${message.carPlateNumber}</td>
                            <td class="mdl-data-table__cell--non-numeric">${message.locationName}</td>
                            <td class="mdl-data-table__cell--non-numeric">${message.description}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <a href="/message.html?id=${message.id}" class="mdl-button mdl-js-button mdl-button--primary view-message">View</a>
                            </td>
                        </tr>`
                    })

                    document.getElementById('tbody').innerHTML = tableData
                })
            })


    } catch (e) {
        console.log(e);
        console.log('Error loading the Firebase SDK, check the console.')
    }
})

function hideLoader() {
    document.querySelector('.loader').style.display = "none";
}


function showDashboard() {
    if (document.querySelector('#app')) {
        document.querySelector('#app').style.display = "initial";
    }
}