import React from "react";
import {
  useDisclosure,
  Button,
  SlideIn,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Link,
  Scale,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogCloseButton
} from "@chakra-ui/core";

function AlertDialogContainer({ isOpen, onClose, title, body }) {
  const cancelRef = React.useRef();

  return (
    <>
      {/* You can swap the `Scale` with `SlideIn` to see a different transition */}
      <Scale in={isOpen}>
        {styles => (
          <AlertDialog
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isOpen={true}
          >
            <AlertDialogOverlay opacity={styles.opacity} />
            <AlertDialogContent {...styles}>
              <AlertDialogHeader>{title}</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>{body}</AlertDialogBody>
              <AlertDialogFooter>
                <Button ml={3} ref={cancelRef} onClick={onClose}>
                  Ok
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </Scale>
    </>
  );
}
export default AlertDialogContainer;
