import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header";
import { FooterComponent } from "./footer/footer";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
