/* document ready */
document.addEventListener("DOMContentLoaded", () => {
  checkDeviceW();
  selectTripleComp();
  expandAbbreviations();
  confirmData();
});

/* check the width of device */
let checkDeviceW = () => {
  /* remove flex to allow scroll on small devices */
  let removeFlex = () => {
    if (window.innerWidth < 992) {
      document.querySelector("main").classList.remove("d-flex", "flex-nowrap");
      document.querySelector(".section-closed").classList.remove("text-rotate");
    } else {
      document.querySelector("main").classList.add("d-flex", "flex-nowrap");
      document.querySelector(".section-closed").classList.add("text-rotate");
    };
  };
  /* on document ready */
  removeFlex();
  /* on resize */
  window.addEventListener("resize", () => {
    removeFlex();
  });
};

/* select triple subject and object */
let selectTripleComp = () => {
  /* subject */
  var biblStr;

  /* object / array of bibl */
  var biblArr = [];

  /* object / array of uri */
  var uriArr = [];

  /* subject / object */
  var txts = document.querySelectorAll(".select-txt");
  txts.forEach((txt) => {
    txt.addEventListener(("click"), (e) => {
      /* data */
      var tripleRole = e.target.getAttribute("data-triple");
      var uri = e.target.getAttribute("data-uri");
      var author = e.target.getAttribute("data-author");
      var title = e.target.getAttribute("data-title");
      var pubdate = e.target.getAttribute("data-dataPub");
      biblStr = "<b>" + author + "</b>" + "<span>, </span>" + "<i>" + title + "</i>" + "<span>, </span>" + "<span>" + pubdate + "</span>";

      /* set the data in the subject/object of the triple */
      var tripleComps = document.querySelectorAll("." + tripleRole);
      tripleComps.forEach((comp) => {

        /* if object add/remove bibl from array because of checkbox */
        /* OBJECT */
        if (comp.classList.contains("object")) {

          /* add checked texts to array */
          if (e.target.checked) {
            /* bibl */
            if (!biblArr.includes(biblStr)) {
              biblArr.push(biblStr);
            };

            /* uri */
            if (!uriArr.includes(uri)) {
              uriArr.push(uri);
            };
          } else {
            /* bibl */
            if (biblArr.includes(biblStr)) {
              const index = biblArr.indexOf(biblStr);
              if (index > -1) {
                biblArr.splice(index, 1);
              };
            };

            /* uri */
            if (uriArr.includes(uri)) {
              const index = uriArr.indexOf(uri);
              if (index > -1) {
                uriArr.splice(index, 1);
              };
            };
          };

          /* print the bibl str */
          comp.innerHTML = "";
          if (biblArr.length > 1) {
            biblArr.forEach((bibl) => {
              comp.innerHTML += "<span class='btn-triple-divider'>" + bibl + "</span>";
            });
          } else {
            biblArr.forEach((bibl) => {
              comp.innerHTML += bibl;
            });
          };

          /* pass the variables to submit */
          document.querySelector(".submit-triple").setAttribute("data-object", uriArr.join("___"));
          document.querySelector(".submit-triple").setAttribute("data-bibl-object", biblArr.join("___"));

        } else {
          /* SUBJECT */
          /* print the bibl str */
          comp.innerHTML = biblStr;

          /* pass the variables to submit */
          document.querySelector(".submit-triple").setAttribute("data-subject", uri);
          document.querySelector(".submit-triple").setAttribute("data-bibl-subject", biblStr);
        };

      });

      /* block / unblock save button */
      blockSaveBtn();

    });
  });

};

/* expand abbreviations */
let expandAbbreviations = () => {
  var abbreviations = document.querySelectorAll(".triple-comp");
  abbreviations.forEach((abbr) => {
    abbr.addEventListener(("click"), () => {
      if (abbr.classList.contains("btn-triple") == true) {
        abbr.classList.remove("btn-triple");
      } else {
        abbr.classList.add("btn-triple");
      };
    });
  });
};

/* block buttons if not enough data */
let blockSaveBtn = () => {
  /* options */
  var options = document.querySelectorAll(".select-txt");
  var selectedSubj = [];
  var selectedObj = [];

  /* buttons */
  var saveBtn = document.querySelector(".submit-triple");
  var confirmBtn = document.querySelector(".btn-confirm");
  var cancelBtn = document.querySelector(".btn-cancel");

  /* block confirm/cancel btn */
  confirmBtn.setAttribute("disabled", "disabled");
  cancelBtn.setAttribute("disabled", "disabled");

  /* check if there's at least 1 subj and 1 obj */
  options.forEach((opt) => {
    if (opt.checked == true) {
      if (opt.getAttribute("data-triple") == "subject") {
        selectedSubj.push(opt);
      } else if (opt.getAttribute("data-triple") == "object") {
        selectedObj.push(opt);
      };
    };
  });

  /* if at least 1 subj and 1 obj */
  if (selectedSubj.length > 0 && selectedObj.length > 0) {
    /* enable save button */
    saveBtn.removeAttribute("disabled");
  } else {
    /* if no subj and obj / disable save button */
    saveBtn.setAttribute("disabled", "disabled");
  };

};

/* confirm data */
let confirmData = () => {
  var confirmBtn = document.querySelector(".btn-confirm");
  confirmBtn.addEventListener("click", () => {

    /* triple */
    var subject = document.querySelector("[data-type='triple'][data-role='subject']").innerHTML;
    var predicate = document.querySelector("[data-type='triple'][data-role='predicate']").innerHTML;
    var object = document.querySelector("[data-type='triple'][data-role='object']").innerHTML;

    /* buttons */
    var saveBtn = document.querySelector(".submit-triple");
    var confirmBtn = document.querySelector(".btn-confirm");
    var cancelBtn = document.querySelector(".btn-cancel");

    if (subject !== "" && predicate !== "" && object !== "") {
      let text = "Do you confirm this data?";
      if (confirm(text) == true) {
        alert("Data added to the knowledge base!");

        /* block/unblock save/confirm/cancel button */
        confirmBtn.setAttribute("disabled", "disabled");
        cancelBtn.setAttribute("disabled", "disabled");
        saveBtn.setAttribute("disabled", "disabled");
      } else {
        prompt("What's wrong with these data?");

        /* block/unblock save/confirm/cancel button */
        confirmBtn.setAttribute("disabled", "disabled");
        cancelBtn.setAttribute("disabled", "disabled");
        saveBtn.setAttribute("disabled", "disabled");
      }
    } else {
      alert("Let's insert at least one subject, predicate, and object to confirm data.");
    };
  });
};