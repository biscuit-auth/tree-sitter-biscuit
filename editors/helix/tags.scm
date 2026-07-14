; SPDX-FileCopyrightText: 2023 Clément Delafargue <clement@delafargue.name>
;
; SPDX-License-Identifier: Apache-2.0

; Rules - tag the head predicate name
(rule
  head: (predicate
    (nname) @name)) @definition.function

; Facts - tag the fact name
(fact
  (nname) @name) @definition.function

; Checks
(check) @definition.function

; Policies
(policy) @definition.function
