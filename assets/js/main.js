document.addEventListener("DOMContentLoaded", () => {
  checkDeviceW();
  selectTripleComp();
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

  /* set subject/predicate/object attribute to submit button */
  var submit = document.querySelectorAll(".submit-data");

  /* subject / object */
  var txts = document.querySelectorAll(".select-txt");
  txts.forEach((txt) => {
    txt.addEventListener(("click"), (e) => {
      /* data */
      var tripleRole = e.target.getAttribute("data-triple");
      var author = e.target.getAttribute("data-author");
      var title = e.target.getAttribute("data-title");
      var pubdate = e.target.getAttribute("data-dataPub");
      biblStr = "<b>" + author + "</b>" + "<span>, </span>" + "<i>" + title + "</i>" + "<span>, </span>" + "<span>" + pubdate + "</span>";

      /* set the data in the subject/object of the triple */
      var tripleComps = document.querySelectorAll("." + tripleRole);
      tripleComps.forEach((comp) => {

        /* if object add/remove bibl from array because of checkbox */
        if (comp.classList.contains("object")) {
          comp.classList.add("btn-triple");

          /* add checked texts to array */
          if (e.target.checked) {
            if (!biblArr.includes(biblStr)) {
              biblArr.push(biblStr);
            };
          } else {
            if (biblArr.includes(biblStr)) {
              const index = biblArr.indexOf(biblStr);
              if (index > -1) {
                biblArr.splice(index, 1);
              };
            };
          };

          /* print the bibl str */
          if (comp.innerHTML !== "") {
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
          } else {
            comp.innerHTML = "object";
          };

          /* submit button / object */
          var obj = biblArr.join("___");

          submit.forEach((btn) => {
            btn.setAttribute("data-object", obj);
          });

        } else {
          /* print the bibl str */
          comp.classList.add("btn-triple");
          comp.innerHTML = biblStr;

          /* submit button / object */
          submit.forEach((btn) => {
            btn.setAttribute("data-subject", biblStr);
          });
        };
      });

      /* expand abbreviation */
      expandAbbreviations();
    });
  });

  /* predicate */
  var selectPredicate = document.querySelectorAll(".select-predicate");
  selectPredicate.forEach((select) => {
    select.addEventListener("change", (e) => {
      var options = e.target;
      var predicate = options.value;
      /* submit button / predicate */
      submit.forEach((btn) => {
        btn.setAttribute("data-predicate", predicate);
      });
    });
  });
};

/* expand abbreviations */
let expandAbbreviations = () => {
  var abbreviations = document.querySelectorAll(".triple-comp");
  abbreviations.forEach((abbr) => {
    abbr.addEventListener(("click"), () => {
      abbr.classList.toggle("btn-triple");
    });
  });
};

/* save data for rdf generation */
let rdfData = () => {
  /* click on submit buttons */
  var submits = document.querySelectorAll(".submit-data");
  submits.forEach((submit) => {
    submit.addEventListener("click", () => {
      /* strip html tags */

      /* objects */
      var subj = submit.getAttribute("data-subject");
      console.log(subj);

      /* objects */
      var objs = submit.getAttribute("data-object").split("___");
      objs.forEach((obj) => {
        console.log("Object: " + obj.replace(/(<([^>]+)>)/gi, ""));
      });
    });
  });
};