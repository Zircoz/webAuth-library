const { startAttestation } = SimpleWebAuthnBrowser;

// <button>
  const elemBegin = document.getElementById('btnBegin');
  // <span>/<p>/etc...
  const elemSuccess = document.getElementById('success');
  // <span>/<p>/etc...
  const elemError = document.getElementById('error');
  //form fields
  var fullName = document.getElementsByName("fullname");
  var userEmail = document.getElementsByName("email");
  var userName = document.getElementByName("username");
  // Start attestation when the user clicks a button
  elemBegin.addEventListener('click', async () => {
    // Reset success/error messages
    elemSuccess.innerHTML = '';
    elemError.innerHTML = '';

    // GET attestation options from the endpoint that calls
    // @simplewebauthn/server -> generateAttestationOptions()
    const resp = await fetch('/generate-attestation-options',{
      method: 'POST',
      headers: {
        'Content-Type': 'applcation/json',
      },
      body: {
        fullname: fullName,
        email: userEmail,
        username: userName,
      }
    });

    let attResp;
    try {
      // Pass the options to the authenticator and wait for a response
      attResp = await startAttestation(await resp.json());
    } catch (error) {
      // Some basic error handling
      if (error.name === 'InvalidStateError') {
        elemError.innerText = 'Error: Authenticator was probably already registered by user';
      } else {
        elemError.innerText = error;
      }

      throw error;
    }

    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyAttestationResponse()
    const verificationResp = await fetch('/verify-attestation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attResp)
    });

    // Wait for the results of verification
    const verificationJSON = await verificationResp.json();

    // Show UI appropriate for the `verified` status
    if (verificationJSON && verificationJSON.verified) {
      elemSuccess.innerHTML = 'Success!';
    } else {
      elemError.innerHTML = `Oh no, something went wrong! Response: <pre>${JSON.stringify(
        verificationJSON,
      )}</pre>`;
    }
  });
