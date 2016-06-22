$.ready(function () {
  var teachers;
  setUpIndexPage();
  listenForHashChanges();
});


function setUpIndexPage(){
  $.ajax({
    url: 'http://spa-badge-api.herokuapp.com/teachers',
    type: 'GET'
  }).then(function(response){
    teachers = JSON.parse(response);
    showTeacherList(teachers);
  }).catch(function(response) {
    console.log(response);
  })
}

function findTeacher(name){
  return teachers.filter(function(teacher){
    return teacher.name == name;
  })
}

function showTeacherList(teachers) {
  var theTemplateScript = miniQuery("#teacher-template").select()[0].innerHTML;
  var theTemplate = Handlebars.compile(theTemplateScript);
  var context = { teachers: teachers}
  var theCompiledHtml = theTemplate(context);
  miniQuery('.teachers-placeholder').select()[0].innerHTML = theCompiledHtml;
}

function showTeacherBadges(teacher) {
  var theTemplateScript = miniQuery("#teacher-badge-template").select()[0].innerHTML;
  var theTemplate = Handlebars.compile(theTemplateScript);
  var theCompiledHtml = theTemplate(teacher);
  miniQuery('#show').select()[0].innerHTML = theCompiledHtml;
}

function toggleViews(elemToHide, elemToShow) {
  miniQuery(elemToHide).hide();
  miniQuery(elemToShow).show();
}

function setUpTeacherPage(name, teacher_id) {
  $.ajax({
    url: "http://spa-badge-api.herokuapp.com/teachers/" + teacher_id,
    type: "GET"
  }).then(function(response){
    var teacher = JSON.parse(response);
    showTeacherBadges(teacher);

    miniQuery('.submit-form').on('submit', function(event){
      event.preventDefault();
      var url = this.getAttribute("action");
      var inputs = this.getElementsByTagName('input')
      var phrase = inputs.phrase.value;
      var teacher_id = inputs.teacher_id.value;
      var votes = inputs.votes.value;

      $.ajax({
        url: url,
        type: 'POST',
        data: "phrase="+phrase+"&teacher_id="+teacher_id+"&votes="+votes
      }).then(function(response) {

        var badge = JSON.parse(response);
        var theTemplateScript = miniQuery("#badge-template").select()[0].innerHTML;
        var theTemplate = Handlebars.compile(theTemplateScript);
        var theCompiledHtml = theTemplate(badge);
        miniQuery('.show-user').select()[0].innerHTML += theCompiledHtml;
      }).catch(function(response) {
        console.log(response);
      })
    })
  })
}

function listenForHashChanges(argument) {
  window.addEventListener('hashchange', function(){
    if (!location.toString().match(/\#/)) {
      toggleViews('#show', '#index');
    } else {
      toggleViews('#index', '#show');

      var name = location.toString().split('#')[1]
      var teacher_id = findTeacher(name)[0].id;
      setUpTeacherPage(name, teacher_id)
    }
  })
}
