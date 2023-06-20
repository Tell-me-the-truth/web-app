document.addEventListener("DOMContentLoaded", () => {
  checkDeviceW();
  selectTripleComp();
  expandAbbreviations();
  rdfData();
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
        rdfObject.classList.add("rdf-semicolon");
      } else {
        rdfSubject.innerHTML = "";
        rdfObject.classList.remove("rdf-semicolon");
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
          rdfObject.classList.remove("rdf-full-stop");
          rdfObject.classList.add("rdf-semicolon");
        });
      } else if (objects.length = 1) {
        rdfObject.innerHTML = "";
        objects.forEach((object) => {
          if (object == "") {
            rdfObject.innerHTML = "";
            rdfObject.classList.remove("rdf-full-stop");
            rdfObject.classList.remove("rdf-semicolon");
          } else {
            rdfObject.innerHTML += "&#x3c;" + object + "&#x3e;";
            rdfObject.classList.add("rdf-full-stop");
            rdfObject.classList.remove("rdf-semicolon");
          };
        });
      };

    });
  });
};