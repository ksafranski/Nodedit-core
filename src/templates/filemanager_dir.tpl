<ul>
{{#eachkeys data}}
    <li data-path="{{this.value.path}}"><a class="{{this.value.type}}"><span class="{{this.value.icon}}"></span>{{this.key}}</a></li>
{{/eachkeys}}
</ul>