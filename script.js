const $ = document.querySelector.bind(document);
const quoteContainer = $('#quote-container'),
  quote = $('#quote'),
  author = $('#author'),
  twitterBtn = $('#twitter'),
  newQuoteBtn = $('#new-quote');

// Custom Events
const spinStart = new CustomEvent('spinStart', {
  detail: {
    node: (() => {
      const _node = quoteContainer.cloneNode(false);
      _node.innerHTML = '<div id="spin"></div>';
      return _node;
    })()
  }
});
const spinEnd = new CustomEvent('spinEnd', {
  detail: {
    node: quoteContainer
  }
});

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

quoteContainer.addEventListener('spinStart', e => {
  quoteContainer.replaceWith(e.detail.node);
});

quoteContainer.addEventListener('spinEnd', e => {
  $('#quote-container').replaceWith(e.detail.node);
});

// On Load
getQuote();

/* Functions */
// Get Quote From API Function
async function getQuote(trials = 0) {
  if (trials > 10) return;
  // Start Spin
  quoteContainer.dispatchEvent(spinStart);

  const proxyUrl = 'http://localhost:3000/';
  const ApiUrl = 'http://api.forismatic.com/api/1.0/?lang=en&method=getQuote&format=json';

  try {
    const response = await fetch(proxyUrl + encodeURIComponent(ApiUrl));

    const quoteData = await response.json();
    // End Spin
    quoteContainer.dispatchEvent(spinEnd);
    // Assign Author
    author.innerText = quoteData.quoteAuthor || 'Unknown';
    // Reduce font size for long quotes
    quoteData.quoteText.length > 20 ?
      quote.classList.add('quote-long')
      : quote.classList.remove('quote-long');
    // Assign Quote
    quote.innerText = quoteData.quoteText;
  } catch (error) {
    setTimeout(getQuote, 500, ++trials);
    console.log('No Quote ->', error);
  }
}
// Tweet the Quote
function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;

  window.open(twitterUrl, '_blank');
}