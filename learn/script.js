$(document).ready(function() {
    $('#run-btn').click(function() {
      let code = $('#python-code').val();
      let consoleOutput = $('#console-output');
  
      consoleOutput.text('Running...');
  
      $.ajax({
        url: '/run',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ code: code }),
        success: function(data) {
          
          if (data.error) {
            consoleOutput.text("Error:\n" + data.error);
          } else {
            consoleOutput.text(data.output);
          }
        },
        error: function(xhr, status, error) {
          consoleOutput.text("AJAX error:\n" + error);
        }
      });
    });
});