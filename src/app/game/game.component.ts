import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard = ''
  game: Game;

  constructor(private firestore: AngularFirestore, public dialog: MatDialog) { }

  

  ngOnInit(): void {
    this.newGame()
    this.firestore.
    collection('games').
    valueChanges().
    subscribe((game) => {
      console.log('Game update', game)
    }
    );
  }

  newGame() {
    this.game = new Game()
    console.log(this.game)
  }



  takeCard() {
    if(!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop()
      this.pickCardAnimation = true;

      this.game.currentPlayer++
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length

      setTimeout(()=> {
        this.pickCardAnimation = false
        this.game.playedCards.push(this.currentCard)

        console.log('newCard', this.currentCard)
      console.log('game', this.game)
      },1000)
      }
    }




    openDialog(): void {
      const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
        
      });
  
      dialogRef.afterClosed().subscribe((name:string) => {
        if(name && name.length > 0) {
          this.game.players.push(name)
        }
        
        
      });
    } 

}
