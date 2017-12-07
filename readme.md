# Hare

Hare is a fully integrated development environment.

It merges the concept of a programming language & tools, interpreter, IDE, Git, Agile, DevOps and databases.

# To Do

[x] Extract compiler code into its own file
[ ] Extract save code into its own file
[ ] Extract loader code into its own file
[ ] Redesign the data structures for the editor and rendering

# Upcoming

- Add some form of indentation to rendering, so this becomes readable:

    (do
      (var swap (func (arr i j)
                  (do (var temp (get arr i))
                      (set arr i (get arr j))
                      (set arr j temp)
                  )
                )
      )
      (var a (list 1 2 3))
      (swap a 0 2)
      a)

- Add syntax highlighting
- Add embed/move_to/cut/copy/paste
