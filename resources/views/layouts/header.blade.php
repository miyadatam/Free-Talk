@if(session('flash_message'))
<div id="flashMessage">
  <flash-message message="{{ session('flash_message') }}" error="false"></flash-message>
</div>
@elseif(session('flash_message_error'))
<div id="flashMessage">
  <flash-message message="{{ session('flash_message_error') }}" error="true"></flash-message>
</div>
@endif
