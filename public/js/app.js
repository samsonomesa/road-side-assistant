document.addEventListener('DOMContentLoaded', function () {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    try {
        let app = firebase.app();
        let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
        console.log(`Firebase SDK loaded with ${features.join(', ')}`)

        firebase.auth().onAuthStateChanged(user => {

            if (user) {
                showDashboard()
                hideLoader()
                hideLogin()
                hideRegister()
                console.log('Show dashboard')
            } else {
                hideLoader();
                showLogin();
                hideDashboard();
                console.log('Show login form')
            }

        })

        document.getElementById('login-login-btn').addEventListener('click', event => {
            event.preventDefault()

            const email = document.getElementById('login-email-field').value;
            const password = document.getElementById('login-password-field').value;


            if (email == null || email == '' || password == null || password == '') {
                const snackbarContainer = document.querySelector('#login-snackbar')

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

            showLoader();
            login(email, password)


        })

        document.getElementById('register-register-button').addEventListener('click', e => {
            e.preventDefault()

            //Similar to login steps
            const email = document.getElementById('register-email-field').value;
            const password = document.getElementById('register-password-field').value;


            if (email == null || email == '' || password == null || password == '') {
                const snackbarContainer = document.querySelector('#register-snackbar')

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

            showLoader();
            register(email, password)
            //END OF THE STEPS
        })

        document.getElementById('login-register-btn').addEventListener('click', e => {
            console.log('Show Register')
            e.preventDefault()
            showRegister();
            hideLogin();
            hideDashboard();
        })

        document.getElementById('register-login-btn').addEventListener('click', e => {
            e.preventDefault()
            showLogin();
            hideRegister();
            hideDashboard();
        })

        document.querySelector('#logout-btn').addEventListener('click', event => {
            firebase.auth().signOut().then(e => {
                console.log(e)
            }, error => {
                console.log(error)
            });
        })

    } catch (e) {
        console.error(e);
        console.log('Error loading the Firebase SDK, check the console.')
    }
});

function showLogin() {
    if (document.getElementById('login')) {
        document.getElementById('login').style.display = "flex";
    }
}

function showRegister() {
    if (document.getElementById('register')) {
        document.getElementById('register').style.display = "flex";
    }
}

function showDashboard() {
    if (document.querySelector('#app')) {
        document.querySelector('#app').style.display = "initial";
    }
}

function showLoader() {

    if (document.querySelector('.loader')) {
        document.querySelector('.loader').style.display = "flex";
    }
}



function hideLogin() {
    if (document.getElementById('login')) {
        document.getElementById('login').style.display = "none";
    }
}

function hideRegister() {

    if (document.getElementById('register')) {
        document.getElementById('register').style.display = "none";
    }
}

function hideDashboard() {
    if (document.querySelector('#app')) {
        document.querySelector('#app').style.display = "none";
    }
}

function hideLoader() {

    if (document.querySelector('.loader')) {
        document.querySelector('.loader').style.display = "none";
    }
}

const login = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        hideLoader();

        console.log(`Code ${error.code}`)
        console.log(`Code ${error.message}`)

        const snackbarContainer = document.querySelector('#login-snackbar')

        const handler = event => {
            console.log(event)
            console.log('Handle What?')
        }


        let data = {
            message: 'Invalid Credentials.',
            timeout: 2000,
            actionHandler: handler,
            actionText: 'RETRY'
        };

        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    });

}

const register = (email, password) => {

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
        hideLoader();
        console.log(`Code ${error.code}`)
        console.log(`Code ${error.message}`)

        const snackbarContainer = document.querySelector('#register-snackbar')

        const handler = event => {
            console.log(event)
            console.log('Handle What?')
        }


        let data = {
            message: 'An error occurred.',
            timeout: 2000,
            actionHandler: handler,
            actionText: 'RETRY'
        };

        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    })
}