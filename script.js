// #region UI

var btnRun = document.getElementById('btn-run');
var btnClear = document.getElementById('btn-clear');
var divOutput = document.getElementById('div-output');

btnRun.addEventListener('click', function(e) {
  execute();
});

btnClear.addEventListener('click', function(e) {
  divOutput.innerHTML = null;
});

function output(message, level) {
  var paragraph = document.createElement('p');
  var small = document.createElement('small');
  paragraph.classList.add('font-monospace');
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
  output('<strong>SCRIPT EXECUTION STARTED</strong>');
  output('Getting articles...');
  axios.get('https://api.zpruszkowa.pl/items/articles')
  .then(function(res) {
    output('Request succeeded', 'success');
    output('Check console to view response details');
    console.log(res);
  })
  .catch(function(err) {
    output('Request failed', 'danger');
    output(err, 'danger');
  })
  .then(function(){
    output('<strong>SCRIPT EXECUTION FINISHED</strong>');
  });
}
// #endregion SCRIPT