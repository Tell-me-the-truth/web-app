/* document ready */
document.addEventListener("DOMContentLoaded", () => {
  checkDeviceW();
  selectTripleComp();
  expandAbbreviations();
  rdfData();
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

        } else {
          /* SUBJECT */
          /* print the bibl str */
          comp.innerHTML = biblStr;

          /* pass the variables to submit */
          document.querySelector(".submit-triple").setAttribute("data-subject", uri);
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
    saveBtn.removeAttribute("disabled");
  } else {
    /* if no subj and obj */
    saveBtn.setAttribute("disabled", "disabled");
  };

};

/* save data for rdf generation */
let rdfData = () => {
  /* click on submit buttons */
  var submits = document.querySelectorAll(".submit-triple");
  submits.forEach((submit) => {
    submit.addEventListener("click", () => {

      /* triple values */
      var subject = submit.getAttribute("data-subject");
      var predicateSelect = document.querySelector(".select-predicate");
      var objects = submit.getAttribute("data-object").split("___");

      /* triple rdf components */
      var rdfSubject = document.querySelector("[data-type='triple'][data-role='subject']");
      var rdfPredicate = document.querySelector("[data-type='triple'][data-role='predicate']");
      var rdfObject = document.querySelector("[data-type='triple'][data-role='object']");

      /* subject */
      if (subject !== null) {
        rdfSubject.innerHTML = "&#x3c;" + subject + "&#x3e;";
      } else {
        rdfSubject.innerHTML = "";
      };

      /* predicate */
      var predicate = predicateSelect.options[predicateSelect.selectedIndex].text;
      var prefix = predicateSelect.options[predicateSelect.selectedIndex].getAttribute("data-prefix");
      rdfPredicate.innerHTML = prefix + predicate;

      /* object */
      if (objects.length > 1) {
        rdfObject.innerHTML = "";
        objects.forEach((object) => {
          rdfObject.innerHTML += "<span>" + "&#x3c;" + object + "&#x3e;" + "</span>";
        });
      } else if (objects.length = 1) {
        rdfObject.innerHTML = "";
        objects.forEach((object) => {
          if (object == "") {
            rdfObject.innerHTML = "";
          } else {
            rdfObject.innerHTML += "<span>" + "&#x3c;" + object + "&#x3e;" + "</span>";
          };
        });
      };

      /* NOTE */
      var note = document.querySelector(".scholarly-note").value;
      var rdfPredicateNote = document.querySelector("[data-type='triple'][data-role='predicate-note']");
      var rdfObjectNote = document.querySelector("[data-type='triple'][data-role='object-note']");
      if (note !== "") {
        rdfPredicateNote.innerHTML = "ecrm:P3_has_note";
        rdfObjectNote.innerHTML = "<span>" + '"' + note + '"' + "</span>";
      } else {
        rdfPredicateNote.innerHTML = "";
        rdfObjectNote.innerHTML = "";
      };

      /* PUNCTUATION */
      var objsToDivide = document.querySelectorAll("[data-punctuation='check'] span");
      var objsToDivideLen = objsToDivide.length - 1;
      var lastObj = objsToDivide[objsToDivideLen];

      objsToDivide.forEach((obj) => {
        /* NOTE */
        if (obj.parentNode.getAttribute("data-role") == "object-note") {
          obj.classList.add("rdf-full-stop");
        } else {
          /* OTHER OBJECTS */
          /* if more than one object */
          /* if the next element sibling is empty */
          /* add ; to all the objects except the last that is assigned with . */
          if (obj.parentNode.nextElementSibling.innerHTML == "") {
            if (obj.parentNode.children.length > 1) {
              obj.classList.add("rdf-semicolon");
              lastObj.classList.remove("rdf-semicolon");
              lastObj.classList.add("rdf-full-stop");
            } else {
              obj.classList.add("rdf-full-stop");
            };
          } else {
            /* if the next element sibling is not empty */
            /* add ; to all the objects */
            obj.classList.add("rdf-semicolon");
          };
        };
      });

      /* block/unblock save/confirm/cancel button */
      var saveBtn = document.querySelector(".submit-triple");
      var confirmBtn = document.querySelector(".btn-confirm");
      var cancelBtn = document.querySelector(".btn-cancel");
      confirmBtn.removeAttribute("disabled");
      cancelBtn.removeAttribute("disabled");
      saveBtn.setAttribute("disabled", "disabled");
    });
  });
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