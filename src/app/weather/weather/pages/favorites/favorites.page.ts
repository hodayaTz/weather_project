import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService } from 'src/app/core/services/favorites.service';
import { LocationService } from 'src/app/core/services/location.service';
import { WeatherService } from 'src/app/core/services/weather.service';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { Location } from 'src/app/shared/models/location.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss']
})
export class FavoritesPage implements OnInit {

  locations: Location[];
  displayedColumns: string[] = ['position', 'cityName', 'forecast', 'rFavorite', 'weather'];
  weathers: CurrentWeather[] = [];

  constructor(private _weatherService: WeatherService, private _favoritesService: FavoritesService, private _router: Router, private lo: LocationService) { }

  ngOnInit(): void {
    this.getCurrentWeather()
  }

  getCurrentWeather() {
    this.locations = this._favoritesService.getFavorites();
    console.log(this.locations)
    this.locations.forEach(element => {
      this._weatherService.getCurrentWeather(element.Key).subscribe(w => {
        this.weathers.push(w[0])
      }, err => alert('Something Wrong!!'))
    });
  }

  getCityWeather(locationKey: string) {
    this._router.navigate(["search/", locationKey]);
  }

  weather() {
    this._router.navigate(["search"]);
  }

  removeFromFavorites(location: Location) {
    this._favoritesService.removeFromFavorites(location.Key);
    this.getCurrentWeather();
  }

}
