import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { CalendarComponent } from "./components/date-picker/date-picker.component";
import { HttpClientModule } from "@angular/common/http";
import { WindowRef } from "./windowRef";
import { NasaHeaderComponent } from "./components/header/header.component";
import { NasaSearchComponent } from "./components/seachbar/search.component";
import { appRoutingComponents, AppRoutingModule } from "./app-routing.module";
import { YouTubePlayerModule } from "@angular/youtube-player";

@NgModule({
    declarations: [
        AppComponent,
        CalendarComponent,
        appRoutingComponents,
        NasaHeaderComponent,
        NasaSearchComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        YouTubePlayerModule,
        AppRoutingModule
    ],
    providers: [WindowRef],
    bootstrap: [AppComponent]
})
export class AppModule {
}
