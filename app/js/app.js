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

function showTeacherBadge(badge) {
  var theTemplateScript = miniQuery("#badge-template").select()[0].innerHTML;
  var theTemplate = Handlebars.compile(theTemplateScript);
  var theCompiledHtml = theTemplate(badge);
  miniQuery('.show-user').select()[0].innerHTML += theCompiledHtml;
}

function toggleViews(elemToHide, elemToShow) {
  miniQuery(elemToHide).hide();
  miniQuery(elemToShow).show();
}

function createABadge(url, phrase, teacher_id, votes) {
  $.ajax({
    url: url,
    type: 'POST',
    data: "phrase="+phrase+"&teacher_id="+teacher_id+"&votes="+votes
  }).then(function(response) {
    var badge = JSON.parse(response);
    showTeacherBadge(badge);
  }).catch(function(response) {
    console.log(response);
  })
}

function addEventToBadgesSubmit() {
  miniQuery('.submit-form').on('submit', function(event){
    event.preventDefault();
    var url = this.getAttribute("action");
    var inputs = this.getElementsByTagName('input')
    var phrase = inputs.phrase.value;
    var teacher_id = inputs.teacher_id.value;
    var votes = inputs.votes.value;
    createABadge(url, phrase, teacher_id, votes);
    addEventToVotesSumbit();
  })
}

function addEventToVotesSumbit() {
  miniQuery('.vote-on').on('submit', function (event) {
    event.preventDefault();
    var url = this.firstElementChild.getAttribute("action");
    var id = this.parentNode.getAttribute('id');
    var inputs = this.getElementsByTagName('input');
    var vote_type = inputs.vote_type.value;
    createAVote(url, vote_type, id);
  })
}

function createAVote(url, vote_type, id) {
  $.ajax({
    url: url,
    type: 'POST',
    data: "vote_type="+vote_type
  }).then(function(resoponse) {
    console.log(response);
    var vote = JSON.parse(response);
    console.log(vote);
    miniQuery('#'+id).select()[0].lastElementChild.innerHTML = '(' + vote.votes + ' points)';
  }).catch(function(response) {
    console.log(response);
  })
}

function setUpTeacherPage(name, teacher_id) {
  $.ajax({
    url: "http://spa-badge-api.herokuapp.com/teachers/" + teacher_id,
    type: "GET"
  }).then(function(response){
    var teacher = JSON.parse(response);
    showTeacherBadges(teacher);
    addEventToBadgesSubmit();
    addEventToVotesSumbit();
  }).catch(function(response) {
    console.log(response);
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
