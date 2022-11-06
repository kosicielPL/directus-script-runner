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
  await executeAsync();
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
  divOutput.scrollTop = divOutput.scrollHeight;
};

// #endregion UI

// #region SCRIPT
const executeAsync = async () => {
  try {
    if (state.scriptRunning) {
      output('<strong>Script already set to run. Please wait for its execution to finish or try again later.</strong>', 'warning');
      return;
    }

    output('<strong>Script execution started.</strong>');
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
    output('<strong>Script execution aborted with error.</strong>', 'danger');
    if (error.message) {
      output('Error: ' + error.message, 'danger');
    } else {
      output('Error: ' + error, 'danger');
    }
    console.log(error);
    output('View console for more details', 'info');
  } finally {
    state.scriptRunning = false;
    output('<strong>Script execution finished.</strong>');
  }
};

const fixUserAuthorAsync = async () => {
  output('Running <code>fixUserAuthor</code> script...');

  output('Fetching Directus article authors...');
  const articleAuthors = await getAuthorsAsync();
  const authorsKeys = articleAuthors.data.map(d => d.author);
  output(`Fetch completed. Received ${authorsKeys.length} authors.`);
  
  output('Fetching authors data and articles...');
  for (const key of authorsKeys) {
    output(`Fetching data for author ${key}...`);
    const author = await getAuthorByIdAsync(key);
    const authorArticles = await getArticlesByAuthorIdAsync(author.data.id);
    console.group(`Articles for author ${author.data.id}:`);
    console.log(authorArticles.data);
    console.groupEnd();
    output(`Fetch completed. Received ${authorArticles.data.length} articles.`);
  }
};

const getAuthorsAsync = async () => {
  try {
    const res = await axios({
      url: 'https://api.zpruszkowa.pl/items/articles?groupBy[]=author',
      method: 'get',
      headers: { Authorization: `Bearer ${state.accessToken}` }
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

const getArticlesByAuthorIdAsync = async (authorId) => {
  try {
    const res = await axios({
      url: `https://api.zpruszkowa.pl/items/articles?fields=id&filter[user_author][_null]=true&filter[author][id][_eq]=${authorId}&limit=-1`,
      method: 'get',
      headers: { Authorization: `Bearer ${state.accessToken}` }
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

const getAuthorByIdAsync = async (authorId) => {
  try {
    const res = await axios({
      url: `https://api.zpruszkowa.pl/items/persons/${authorId}?fields=id,name,owner`,
      method: 'get',
      headers: { Authorization: `Bearer ${state.accessToken}` }
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

const patchArticlesUserAuthor = async(articles, userId) => {
  try {
    const res = await axios({
      url: `https://api.zpruszkowa.pl/items/persons/${authorId}?fields=id,name,owner`,
      method: 'get',
      headers: { Authorization: `Bearer ${state.accessToken}` }
    });
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
}
// #endregion SCRIPT