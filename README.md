[The Trolley Problem](http://js1k.com/2015-hypetrain/demo/2323)
=========

>My attempts and tools for JS1K 2015, Hype Train edition. — [Try it online!](https://rawgit.com/ThibWeb/js1k-2015/master/src/traindemo.html)

[![Screenshot of the game](thetrolleyproblem-screenshot.png)](https://rawgit.com/ThibWeb/js1k-2015/master/src/traindemo.html)

~~~
    Will you kill those people, or try to spare them?
    The train is running, the choice is yours to make.
    --
    Press a key, click or touch to switch tracks. Your first action (kill or spare) will determine if you score points by killing, or by sparing people. Do you believe in heaven?
~~~

## Theme

> The JS1k Hype Train is Real!
> The yearly competition is back. This year it's all about hype. And trains. And hype trains! Better hurry, this train is leaving soon.

## Tooling

Contains both UglifyJS & Closure Compiler. Uglify is faster than Closure, but Closure's output is slightly smaller.

First, install everything and set up a fast feedback loop:

~~~
npm install
bower install
npm run start
~~~

Then, start counting bytes and ship it:

~~~
npm run build
npm run test
npm run base64
~~

## TODO

- Wind effect with white transparent lines coming across the screen (towards player?)
- Trees (as awesome as http://js1k.com/2011-trail/demo/994)
- Color palette like Furbee's with hsla http://www.romancortes.com/blog/furbee-my-js1k-spring-13-entry/ `‘hsla(’+[(j&15)*8-x,(j&15)*6+x+’%',(j<17)*60+(j&15)*7+’%',1]+’)’``
- Different game over screen depending on scoring method
- Shock effect: screen / train shake
- Rail changer model
- More points for more morale choice

## Naming / marketing

- Trolley Problem
- Tramway dilemma
- Hype train
- No Brakes
- Railroad
- Moral Brakes ?
- Body count
- Carmageddon
- Karma

### Names

- Karmageddon
- The trolley problem
- Trolleyarmmageddon

## Ideas

- http://knowyourmeme.com/memes/hype-train
- http://www.dorkly.com/post/68989/the-problem-with-the-videogame-hype-train

- Line Rider clone
- Cookie generator
- Transport Tycoon!
- Rainbows!
- A train with a rainbow chimney?
- Platform 9 3/4

### Train

- "There are no brakes on the hype train!"
    +  Jeu en auto scrolling qui accélère où tu dois faire une action au bon moment pour que le train change de voie
- "Catch up with the hype train"
    + Auto-scrolling aussi, il faut rattraper un train en mouvement
- "People on the railroad"
    + https://en.wikipedia.org/wiki/Trolley_problem
    + https://fr.wikipedia.org/wiki/Dilemme_du_tramway
    + Démo avec choix + morale
    + http://youtu.be/YLpn71dxoFY
    + Train carmageddon
    + pour gagner des points, soit écraser le plus de gens possibles soit ne pas en écraser du tout
- "All aboard the hype train!"
- Tu contrôles un train qui est en bas de l'écran et qui a 4 ou 5 wagons 
    + Tu peux juste le faire bouger latéralement 
    + Chaque wagon a un symbole dessus
    + Et des objets de ces symboles tombent du haut de l'écran 
    + Il faut les récupérer dans les wagons correspondants
- Plusieurs trains qui arrivent de différents côtés de l'écran et que tu dois empêcher de rentrer en collision

### Hype

- Jeu de composition de journal pour avoir le plus de hype possible
- Propaganda
    + http://dukope.com/play.php?g=trt
- https://en.wikipedia.org/wiki/Media_circus

### Hype Train

- "maintenir dans un état d'excitation"
    + Ces objets doivent constamment être maintenus en mouvement
    + Aléatoirement ils s'arrêtent 
    + oh comme les chats ?
    + Il faut cliquer ou passer la souris dessus pour les refaire bouger
