window.onload = async function () {
  const data = await fetch("https://raw.githubusercontent.com/greatergoodgg/forms/main/data.json").then((e) => e.json());
  var main = document.getElementById("maingrid");
  for (let i in data) {
    console.log(data[i].content.SA);
    let elem = document.createElement("button");
    elem.className = "gridbtn";
    elem.innerHTML = `<p>${data[i].name}</p>`;
    elem.onclick = async function () {
      document.location.href = `https://greatergoodgg.github.io/forms/pages/view.html?${
        i.toString().length == 2 ? i : "0" + i
      }n00`;
    };
    if (
      Object.keys(data[i].content.SA).length == 0 &&
      data[i].content.misc.length == 0
    )
      elem.disabled = true;
    main.appendChild(elem);
  }
};
