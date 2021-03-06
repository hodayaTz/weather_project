import { Component, OnInit } from '@angular/core';
import { LoaderService } from './core/services/loader.service';
import { WeatherService } from './core/services/weather.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayLoading = false;
  dark:boolean = false;
    
  constructor(private loaderService: LoaderService, private weatherService: WeatherService) {}

  ngOnInit() {
    this.loaderService.stateChange.subscribe((loaderState) => {
      setTimeout(() => {
        this.displayLoading = loaderState;
      });
    });
  }



  lightScreen(){
    console.log('light')
    this.dark = false;
  }

  darkScreen(){
    console.log('dark')
    this.dark = true;
  }

  
}
