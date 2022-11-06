// #region UI

var btnRun = document.getElementById('btn-run');
var btnClear = document.getElementById('btn-clear');
var divOutput = document.getElementById('div-output');
var inputAccessToken = document.getElementById('input-access-token');
var checkRunUserAuthor = document.getElementById('check-run-user-author');

var state = {
  accessToken: null,
  scriptRunning: false,
};

btnRun.addEventListener('click', function(e) {
  e.preventDefault();
  if (state.scriptRunning) {
    output('<strong>Script already set to run. Please wait for its execution to finish and try again</strong>', 'warning');
  } else {
    execute();
  }
});

btnClear.addEventListener('click', function(e) {
  divOutput.innerHTML = null;
});

function output(message, level) {
  var paragraph = document.createElement('p');
  var small = document.createElement('small');
  paragraph.classList.add('font-monospace');
  paragraph.classList.add('mb-0');
  if (level) {
    paragraph.classList.add('text-' + level.toLowerCase());
  }
  var text = '> ' + message;
  small.innerHTML = text;
  paragraph.appendChild(small);
  divOutput.appendChild(paragraph);
}

// #endregion UI

// #region SCRIPT
function execute() {
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
      fixUserAuthorAsync();
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

async function fixUserAuthorAsync() {
  output('Running <code>fixUserAuthor</code> script...');

  output('Requesting Directus users...');
  var usersResponse = await getDirectusUsersAsync();
  console.log(usersResponse);
}

async function getDirectusUsersAsync() {
  return await axios({
    url: 'https://api.zpruszkowa.pl/users',
    method: 'get',
    headers: { Authorization: `Bearer ${state.accessToken}` }
  });
}
// #endregion SCRIPT