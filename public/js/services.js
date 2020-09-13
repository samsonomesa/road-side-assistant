window.addEventListener('DOMContentLoaded', event => {
    //Load the libraries

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


        document.querySelector('#logout-btn').addEventListener('click', event => {
            firebase.auth().signOut().then(e => {
                console.log(e)
            }, error => {
                console.log(error)
            });
        })

        //Firestore Database Instance
        const db = firebase.firestore()

        //Listening for services changes real time
        db.collection("services").onSnapshot(querySnapshot => {
            let services = [];

            querySnapshot.forEach(doc => {
                const {
                    name,
                    description
                } = doc.data()

                services.push({
                    name,
                    description
                })

                let content = ''

                services.forEach((service, index) => {
                    content += `
                    <tr>
                        <td>${++index}</td>
                        <td class="mdl-data-table__cell--non-numeric">${service.name}</td>
                        <td class="mdl-data-table__cell--non-numeric">${service.description}</td>
                        <td class="mdl-data-table__cell--non-numeric">Delete</td>
                    </tr>
                    `
                })


                document.getElementById('tbody').innerHTML = content
            })
        })

        //Registring Add service event handler
        document.getElementById('add-service-button').addEventListener('click', e => {
            //Adding service to firestore
            const name = document.getElementById('service-name').value
            const description = document.getElementById('service-description').value

            if (name == null || name == '' || description == null || description == '') {
                const snackbarContainer = document.querySelector('#service-snackbar')

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

            db.collection("services").add({
                name,
                description
            }).then(docRef => {


                const snackbarContainer = document.querySelector('#service-snackbar')

                const handler = event => {
                    console.log(event)
                    console.log('Handle What?')
                }

                let data = {
                    message: 'Service Added successfully.',
                    timeout: 2000,
                    actionHandler: handler,
                    actionText: 'CLOSE'
                };

                snackbarContainer.MaterialSnackbar.showSnackbar(data);

                console.log(`Services add with id ${docRef.id}`)
                
            }).catch(error => {
                console.log(error)
            })
        })



    } catch (e) {
        console.error(e);
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
const showDialogButton = document.querySelector('#add-service-dialog');

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