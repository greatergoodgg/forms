window.onload = async function () {
  const data = await fetch("https://raw.githubusercontent.com/greatergoodgg/forms/main/data.json").then((e) => e.json());
  const urldata = new URL(window.location.href).search.replace("?", "");

  if (urldata.length > 5)
    window.location.href = `https://greatergoodgg.github.io/forms/pages/view.html?${urldata.slice(0, 5)}`;
  if (!urldata.match(/\d\d[a-zA-Z]\d\d/)) tpTo404();

  const chapnum = parseInt(urldata.slice(0, 2)).toString();

  if (!data.hasOwnProperty(chapnum)) tpTo404();
  if (urldata.charAt(2) == "n" && urldata.slice(3, 5) != "00") tpTo404();

  const chapdata = data[chapnum];
  console.log(urldata);
  console.log(urldata.slice(0, 2));

  document.getElementById("htitle").innerHTML = chapdata["name"];
  if (urldata.charAt(2) == "s") {
    if (
      !chapdata.content.SA.hasOwnProperty(
        parseFloat(urldata.slice(3, 5)).toString()
      )
    )
      tpTo404();
    document
      .getElementById("pdfviewer")
      .setAttribute(
        "src",
        chapdata.content.SA[parseFloat(urldata.slice(3, 5)).toString()]
      );
    document.getElementById("htitle").innerHTML += ` SA #${urldata.slice(
      3,
      5
    )}`;
  }
  if (urldata.charAt(2) == "m") {
    if (chapdata.content.misc.length < parseFloat(urldata.slice(3, 5)))
      tpTo404();
    document
      .getElementById("pdfviewer")
      .setAttribute(
        "src",
        chapdata.content.misc[(parseFloat(urldata.slice(3, 5)) - 1).toString()]
          .link
      );
    document.getElementById("htitle").innerHTML += ` Misc #${urldata.slice(
      3,
      5
    )}`;
  }

  if (Object.keys(chapdata.content.SA).length > 0) {
    let div = document.createElement("div");
    div.className = "container";
    div.id = "SAcontainer";
    div.innerHTML = "<h3>SA</h3>";
    document.getElementById("sidebar").appendChild(div);

    for (const i in chapdata.content.SA) {
      let btn = document.createElement("button");
      btn.innerHTML = `#${i.toString().length == 2 ? i : "0" + i}`;
      btn.addEventListener("click", function () {
        window.location.href = `https://greatergoodgg.github.io/forms/pages/view.html?${
          chapnum.toString().length == 2 ? chapnum : "0" + chapnum
        }s${i.toString().length == 2 ? i : "0" + i}`;
        document
          .getElementById("pdfviewer")
          .setAttribute("src", chapdata.content.SA[i]);
      });
      document.getElementById("SAcontainer").appendChild(btn);
    }
  }
  if (chapdata.content.misc.length > 0) {
    let div = document.createElement("div");
    div.className = "container";
    div.id = "MISCcontainer";
    div.innerHTML = "<h3>Miscellaneous</h3>";
    document.getElementById("sidebar").appendChild(div);

    chapdata.content.misc.forEach(function (i) {
      let btn = document.createElement("button");
      btn.innerHTML = i["name"];
      btn.addEventListener("click", function () {
        const miscI = chapdata.content.misc.findIndex((e) => e == i) + 1;
        window.location.href = `/pages/view.html?${
          chapnum.toString().length == 2 ? chapnum : "0" + chapnum
        }m${miscI.toString().length == 2 ? miscI : "0" + miscI}`;
      });
      document.getElementById("MISCcontainer").appendChild(btn);
    });
  }

  const incgroup = [1, -1];
  for (const inc of incgroup) {
    let testindex = parseInt(chapnum);
    const limit = inc == 1 ? 14 : 0;
    let found = false;

    do {
      testindex += inc;
      if (data.hasOwnProperty(testindex) && checkForContent(data[testindex])) {
        found = true;
        break;
      }
    } while (testindex != limit);

    if (found) {
      if (inc == 1) {
        var btn = document.getElementById("nextbtn");
        var chaptag = document.getElementById("nextchap");
      } else if (inc == -1) {
        var btn = document.getElementById("prevbtn");
        var chaptag = document.getElementById("prevchap");
      }
      chaptag.innerHTML = `${data[testindex].name}`;
      btn.onclick = async function () {
        window.location.href = `https://greatergoodgg.github.io/forms/pages/view.html?${
          testindex.toString().length == 2 ? testindex : "0" + testindex
        }n00`;
      };
    } else if (!found) {
      if (inc == 1)
        document.getElementById("nextbtn").setAttribute("disabled", "true");
      else if (inc == -1)
        document.getElementById("prevbtn").setAttribute("disabled", "true");
    }
  }
  if (document.getElementById("nextchap").innerHTML == "")
    document.getElementById("nextchap").style.visibility = "hidden";
  if (document.getElementById("prevchap").innerHTML == "")
    document.getElementById("prevchap").style.visibility = "hidden";
};

function checkForContent(i) {
  if (Object.keys(i.content.SA).length > 0 || i.content.misc.length > 0)
    return true;
  else return false;
}

function tpTo404() {
  window.location.href = "https://greatergoodgg.github.io/forms/pages/404.html";
}

var SBtoggled = false;
document
  .getElementById("sidebartoggler")
  .addEventListener("click", function () {
    if (!SBtoggled) {
      document.getElementById("sidebar").style.right = "20px";
      SBtoggled = true;
      console.log("Sidebar expanded");
    } else {
      document.getElementById("sidebar").style.right = "-100vw";
      SBtoggled = false;
      console.log("Sidebar collapsed");
    }
  });
