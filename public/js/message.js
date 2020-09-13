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

        //Firestore Database Instance
        const db = firebase.firestore()

        const queryString = window.location.search

        const id = new URLSearchParams(queryString).get('id')

        console.log(`ID: ${id}`) //Debugging

        //Get the information from the cloud now

        db.collection("messages").doc(id)
            .onSnapshot(doc => {

                const {
                    userId,
                    carPlateNumber,
                    description,
                    garage,
                    lat,
                    lng,
                    locationName,
                    productsList,
                    servicesList
                } = doc.data()

                document.getElementById('user-id').value = userId
                document.getElementById('plate-number').innerHTML = carPlateNumber
                document.getElementById('description').innerHTML = description
                document.getElementById('garage').innerHTML = garage
                document.getElementById('location').innerHTML = `${locationName} (${lat}, ${lng})`

                document.getElementById('send-reply-button').addEventListener('click', e => {

                    const title = document.getElementById('reply-title').value
                    const cost = document.getElementById('reply-cost').value
                    const body = document.getElementById('reply-body').value

                    if (title == null || title == '' || cost == null || cost == '' || body == null || body == '') {
                        const snackbarContainer = document.querySelector('#reply-snackbar')

                        const handler = event => {
                            console.log(event)
                            console.log('Handle What?')
                        }

                        let data = {
                            message: 'All the fields are required.',
                            timeout: 2000,
                            actionHandler: handler,
                            actionText: 'RETRY'
                        };

                        snackbarContainer.MaterialSnackbar.showSnackbar(data);

                        return
                    }

                    db.collection("users").doc(userId).collection('notifications').add({
                        userId,
                        title,
                        cost,
                        body
                    }).then(docRef => {

                        const snackbarContainer = document.querySelector('#reply-snackbar')

                        const handler = event => {
                            console.log(event)
                            console.log('Handle What?')
                        }

                        let data = {
                            message: 'Reply Sent successfully.',
                            timeout: 2000,
                            actionHandler: handler,
                            actionText: 'CLOSE'
                        };

                        snackbarContainer.MaterialSnackbar.showSnackbar(data);

                        console.log(`Notification added with id ${docRef.id}`)

                    }).catch(error => {
                        console.log(error)
                    })
                })


            });




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

const dialog = document.querySelector('dialog');
const showDialogButton = document.querySelector('#launch-reply-button');

if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}
showDialogButton.addEventListener('click', function () {
    dialog.showModal();
});

dialog.querySelectorAll('.close').forEach(element => {
    element.addEventListener('click', function () {
        dialog.close();
    });
})