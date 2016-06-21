$.ready(function () {
  var teachers;
  setUpIndexPage();

  window.addEventListener('hashchange', function(){
    if (!location.toString().match(/\#/)) {
      miniQuery('#index').show();
      miniQuery('#show').hide();
    } else {
      miniQuery('#index').hide();
      miniQuery('#show').show();
      var name = location.toString().split('#')[1]
      var teacher_id = findTeacher(name)[0].id;
      console.log(teacher_id);

      $.ajax({
        url: "http://spa-badge-api.herokuapp.com/teachers/" + teacher_id,
        type: "GET"
      }).then(function(response){
       var teacher = JSON.parse(response);
       var theTemplateScript = miniQuery("#teacher-badge-template").select()[0].innerHTML;
       var theTemplate = Handlebars.compile(theTemplateScript);
       var theCompiledHtml = theTemplate(teacher);
       miniQuery('#show').select()[0].innerHTML = theCompiledHtml;
      })

    }

  })


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
