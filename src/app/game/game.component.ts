import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { EditPlayerComponent } from '../edit-player/edit-player.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  
  game: Game;
  gameId:string;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, public dialog: MatDialog) { }

  

  ngOnInit(): void {
    this.newGame()
    this.route.params.subscribe( (params) => {
      console.log('parameter id', params['id'])

      this.gameId = params['id'];

      this.firestore
        .collection('games')
        .doc(this.gameId)
        .valueChanges()
        .subscribe((game:any) => {
          console.log('Game update', game)
          this.game.currentPlayer = game.currentPlayer;
          this.game.playedCards = game.playedCards;
          this.game.players = game.players;
          this.game.stack = game.stack;
          this.game.pickCardAnimation = game.pickCardAnimation;
          this.game.currentCard = game.currentCard;
        });

    });
    // load Data from firebase and show on console
    
  }

  newGame() {
    this.game = new Game()
  }



  takeCard() {
    if(!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop()
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length

      this.saveGame()
      setTimeout(()=> {
        this.game.pickCardAnimation = false
        this.game.playedCards.push(this.game.currentCard)

        console.log('newCard', this.game.currentCard)
      console.log('game', this.game)
      this.saveGame()
      },1000)
      }
    }


    editPlayer(playerId: number) {
      console.log("Editplayer", playerId)
      const dialogRef = this.dialog.open(EditPlayerComponent);

      dialogRef.afterClosed().subscribe((change:string) => {
        console.log("recieved changed", change)
        });
      }

    openDialog(): void {
      const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
        
      });
  
      dialogRef.afterClosed().subscribe((name:string) => {
        if(name && name.length > 0) {
          this.game.players.push(name)
          this.saveGame()
        }
        
        
      });
    } 

    saveGame() {
      this.firestore
      .collection('games')
      .doc(this.gameId)
      .update(this.game.toJson())
    }
}
