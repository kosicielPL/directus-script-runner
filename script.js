// #region UI
const btnRun = document.getElementById('btn-run');
const btnClear = document.getElementById('btn-clear');
const divOutput = document.getElementById('div-output');
const inputAccessToken = document.getElementById('input-access-token');
const checkRunUserAuthor = document.getElementById('check-run-user-author');

const state = {
  accessToken: null,
  scriptRunning: false,
};

btnRun.addEventListener('click', async function(e) {
  e.preventDefault();
  if (state.scriptRunning) {
    output('<strong>Script already set to run. Please wait for its execution to finish and try again</strong>', 'warning');
  } else {
    await executeAsync();
  }
});

btnClear.addEventListener('click', function(e) {
  divOutput.innerHTML = null;
});

const output = (message, level) => {
  const paragraph = document.createElement('p');
  const small = document.createElement('small');
  paragraph.classList.add('font-monospace');
  paragraph.classList.add('mb-0');
  if (level) {
    paragraph.classList.add('text-' + level.toLowerCase());
  }
  const text = '> ' + message;
  small.innerHTML = text;
  paragraph.appendChild(small);
  divOutput.appendChild(paragraph);
}

// #endregion UI

// #region SCRIPT
const executeAsync = async () => {
  try {
    output('<strong>Script execution started</strong>');
    state.scriptRunning = true;

    output('Checking access token...');
    if (!inputAccessToken.value && !state.accessToken) {
      throw new Error('Missing access token!');
    } else if (inputAccessToken.value) {
      state.accessToken = inputAccessToken.value;
    }

    if (checkRunUserAuthor.checked) {
      await fixUserAuthorAsync();
    }
  } catch (error) {
    output('Script execution aborted with error', 'danger');
    if (error.message) {
      output('Error: ' + error.message, 'danger');
    } else {
      output('Error: ' + error, 'danger');
    }
    console.log(error);
    output('View console for more details', 'info');
  } finally {
    state.scriptRunning = false;
    output('<strong>Script execution finished</strong>');
  }
}

const fixUserAuthorAsync = async () => {
  output('Running <code>fixUserAuthor</code> script...');

  output('Requesting Directus users...');
  var usersResponse = await getDirectusUsersAsync();
  console.log(usersResponse);
}

const getDirectusUsersAsync = async () => {
  try {
    const res = await axios({
      url: 'https://api.zpruszkowa.pl/users',
      method: 'get',
      headers: { Authorization: `Bearer ${state.accessToken}` }
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
}
// #endregion SCRIPT