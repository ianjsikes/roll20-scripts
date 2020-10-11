Condition toggle chat buttons

```
[Blinded](!condition toggle blinded)[Charmed](!condition toggle charmed)[Concentrating](!condition toggle concentrating)[Deafened](!condition toggle deafened)[Frightened](!condition toggle frightened)[Grappled](!condition toggle grappled)[Incapacitated](!condition toggle incapacitated)[Invisible](!condition toggle invisibility)[Paralyzed](!condition toggle paralyzed)[Petrified](!condition toggle petrified)[Poisoned](!condition toggle poisoned)[Prone](!condition toggle prone)[Restrained](!condition toggle restrained)[Stunned](!condition toggle stunned)[Unconscious](!condition toggle unconscious)<p>[Clear All](!token-mod --set statusmarkers|=blue|-blue)</p>
```

Experience

```
/w gm &{template:default} {{name=Experience Tracker}} {{Selected Token
[Token](!xp challenge &#64;{selected|npc_xp} &#63;{How many|1} )

Manual
[Manual](!xp challenge &#63;{How much|0} )

End of Session
[Session](!xp session)
}}
```

Spiritual Weapon Summon

```
!slo spiritual-weapon --level=?{Cast at what level|Level 2,2|Level 3,3|Level 4,4|Level 5,5|Level 6,6|Level 7,7|Level 8,8|Level 9,9}
```

Eldritch Cannon Summon

```
!slo eldritch-cannon --cannonName=?{Name of cannon} --type=?{Cannon type|Flamethrower,flame|Force Ballista,ballista|Protector,protector}
```

```
!group-check {{
--hideformula
--public
--?{Which Save Stat|Strength,Strength Save|Dexterity,Dexterity Save|Constitution,Constitution Save|Intelligence,Intelligence Save|Wisdom,Wisdom Save|Charisma,Charisma Save}
--process
--subheader vs DC ?{DC}
--button ApplyDamage !apply-damage
~dmg [[?{Damage}]]
~type ?{Damage on Save|Half,half|None,none}
~DC ?{DC}
~saves RESULTS(,)
~ids IDS(,)
~status red
}}
```

Hexblade Attack
```
!power {{ 
  --name|Longbow
  --Attack Roll|You roll [[ [$atk] ?{Roll Type|Normal,1d20|Advantage,3d20kh1|Disadvantage,2d20kl1} + @{selected|dexterity_mod} + @{selected|pb} ]]
  --?? $atk.base == 20 ?? skipto*1|Critical
  --?? $atk.base == 19 AND #iscursed == 1 ?? skipto*2|Critical
  --?? $atk.base == 1 ?? skipto*3|Fumble
  --?? $atk.total >= @{target|npc_ac} ?? skipto*4|Hit
  
  --:Miss| Since we didn't skip to anywhere else, assume a miss
  --Miss|Your attack missed.
  --skipto*5|EndOfCard

  --:Fumble|
  --Fumble|You miss horribly!
  --Extra Fumble Stuff|Maybe a roll on a fumble table?
  --skipto*6|EndOfCard

  --:Hit|
  --Hit!|Your attack hit for [[ [$Dmg] 1d8 + 1d4 + @{selected|dexterity_mod} + ( 0#iscursed * @{selected|pb} ) ]] damage!
  --skipto*7|EndOfCard

  --:Critical|
  --Critical Hit|You strike a decisive blow for [[ [$CritDmg] 2d8 + 2d4 + @{selected|dexterity_mod} + ( 0#iscursed * @{selected|pb} ) ]] damage!

  --:EndOfCard|
}}
```
