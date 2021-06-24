# PWABuilder - Manifest previewer
A [web component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) that allows you to preview your PWA on Windows, Android and iOS, based on your app's `manifest.json` file!

The table below shows the manifest attributes that this component covers.

Attribute | Description | Screen
----------| ----------- |------- 
`display` | Determines the developers' preferred display mode for the website. The display mode changes how much of browser UI is shown to the user and can range from browser (the default mode). | ![Display](/assets/readme-images/display.png)
`screenshots` | Defines an array of screenshots that showcase the application, used by progressive web app stores. | ![Screenshots](/assets/readme-images/screenshots.png)
`background_color` | Placeholder background color for the application page to display before its stylesheet is loaded. Several platforms use this value to style the splash screen. | ![Background color](/assets/readme-images/backgroundcolor.png)
`name` | String that represents the name of the PWA as it is usually displayed to the user (e.g., amongst a list of other applications in settings, or in menus). | ![Name](/assets/readme-images/name.png)
`short_name` | String that represents the name of the PWA displayed to the user if there is not enough space to display `name` (e.g., as a label for the app's icon on the phone home screen).| ![Short name](/assets/readme-images/shortname.png)
`theme_color` | Defines the default color theme for the application, and affects how the platform displays the site. | ![Theme color](/assets/readme-images/themecolor.png)
`shortcuts` | Array of shortcuts or links to key tasks or pages within a web app, assembling a context menu to be displayed by the OS when a user engages with the app's icon. | ![Shortcuts](/assets/readme-images/shortcuts.png)