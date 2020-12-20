import { Component } from '@angular/core';
import { Color } from 'projects/color/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  Color = Color;
  colors = Color.namedColorList().map(name => Color.parse(name)).concat([new Color(0, 0, 1)]);
}
