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

        //Listening for products changes real time
        db.collection("products").onSnapshot(querySnapshot => {
            let products = [];

            querySnapshot.forEach(doc => {
                const {
                    name,
                    cost,
                    description
                } = doc.data()

                products.push({
                    name,
                    cost,
                    description
                })

                let content = ''

                products.forEach((product, index) => {
                    content += `
                    <tr>
                        <td>${++index}</td>
                        <td class="mdl-data-table__cell--non-numeric">${product.name}</td>
                        <td>${product.cost}</td>
                        <td class="mdl-data-table__cell--non-numeric">${product.description}</td>
                        <td class="mdl-data-table__cell--non-numeric">Delete</td>
                    </tr>
                    `
                })


                document.getElementById('tbody').innerHTML = content
            })
        })

        //Registering Add product event handler
        document.getElementById('add-product-button').addEventListener('click', e => {
            //Adding service to firestore
            const name = document.getElementById('product-name').value
            const cost = document.getElementById('product-cost').value
            const description = document.getElementById('product-description').value

            if (name == null || name == '' || cost == null || cost == '' || description == null || description == '') {
                const snackbarContainer = document.querySelector('#product-snackbar')

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

            db.collection("products").add({
                name,
                cost,
                description
            }).then(docRef => {


                const snackbarContainer = document.querySelector('#product-snackbar')

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

                console.log(`Product added with id ${docRef.id}`)

            }).catch(error => {
                console.log(error)
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

const dialog = document.querySelector('dialog');
const showDialogButton = document.querySelector('#add-product-dialog');

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