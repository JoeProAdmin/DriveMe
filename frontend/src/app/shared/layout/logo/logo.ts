import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './logo.html',
  styleUrl: './logo.scss'
})
export class LogoComponent {
  @Input() compact = false;
  @Input() inverse = false;
  @Input() link = '/';
}
