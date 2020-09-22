/*////// VERTO DEPLOY SCRIPTS ///////*/
/* mutations */
const observer = new MutationObserver(updateReferences);
function updateReferences(mutationsList) {
  for (const record of mutationsList) {
    if (record.type === "attributes") {
      if (record.attributeName === null) continue;
      if (record.target === null || record.target === undefined) continue;
      if (record.attributeName === "href") {
        if (
          record.target.href === undefined ||
          record.target.href === "" ||
          record.target.href.split(window.location.host)[1] === undefined
        )
          continue;
        if (record.target.href.includes(window.location.href.split("/")[3]))
          continue;
        record.target.href =
          "/" +
          window.location.href.split("/")[3] +
          record.target.href.split(window.location.host)[1];
      }
      if (record.attributeName === "src") {
        if (
          record.target.src === undefined ||
          record.target.src === "" ||
          record.target.src.split(window.location.host)[1] === undefined
        )
          continue;
        if (record.target.src.includes(window.location.href.split("/")[3]))
          continue;
        record.target.src =
          "/" +
          window.location.href.split("/")[3] +
          record.target.src.split(window.location.host)[1];
      }
    } else if (record.type === "childList") {
      if (record.addedNodes === undefined || record.addedNodes.length === 0)
        continue;
      for (const elem of record.addedNodes) {
        if (elem.tagName === null || elem.tagName === undefined) continue;
        if (elem.tagName.toLowerCase() === "a")
          addHrefReplaceEventListener(elem);
      }
    }
  }
}
observer.observe(document.documentElement, {
  attributes: true,
  childList: true,
  subtree: true,
});
/* popstate */
(function (history) {
  let pushState = history.pushState;
  history.pushState = function (state) {
    if (typeof history.onpushstate == "function") {
      history.onpushstate({ state: state });
    }
    return pushState.apply(history, arguments);
  };
})(window.history);
window.onpopstate = history.onpushstate = function (e) {
  setTimeout(() => {
    for (const a of document.getElementsByTagName("a")) {
      if (
        a.href === undefined ||
        a.href === "" ||
        a.href.split(window.location.host)[1] === undefined
      )
        continue;
      if (a.href.includes(window.location.href.split("/")[3])) continue;
      a.href =
        "/" +
        window.location.href.split("/")[3] +
        a.href.split(window.location.host)[1];
    }
    for (const el of document.body.getElementsByTagName("*")) {
      if (
        el.src === undefined ||
        el.src === "" ||
        el.src.split(window.location.host)[1] === undefined
      )
        continue;
      if (el.src.includes(window.location.href.split("/")[3])) continue;
      el.src =
        "/" +
        window.location.href.split("/")[3] +
        el.src.split(window.location.host)[1];
    }
  }, 30); /* timeout in case of latency */
};
/* hover */
for (const anchorEl of document.querySelectorAll("a")) {
  addHrefReplaceEventListener(anchorEl);
}
function addHrefReplaceEventListener(elem) {
  elem.addEventListener("mouseover", ({ target }) => {
    if (
      target.href === undefined ||
      target.href === "" ||
      target.href.split(window.location.host)[1] === undefined
    )
      return;
    if (target.href.includes(window.location.href.split("/")[3])) return;
    target.href =
      "/" +
      window.location.href.split("/")[3] +
      target.href.split(window.location.host)[1];
  });
}
/*////// VERTO DEPLOY SCRIPT END ///////*/
