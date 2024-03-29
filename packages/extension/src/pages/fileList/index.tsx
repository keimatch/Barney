import React, { ReactNode } from "react";
import {
  Grid,
  GridItem,
  Input,
  HStack,
  Button,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
import { VscAdd, VscSearch, VscKebabVertical } from "react-icons/vsc";
import dayjs from "dayjs";

import { useFileList } from "./useFileList";
import { Experience } from "../../types/experience";

interface TableRow {
  id: number;
  name: string;
  url: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  menu: ReactNode;
}

interface TableColumn {
  header: string;
  accessor: keyof TableRow;
  minWidth?: number;
  visible: boolean;
}

const DefinedColumns: TableColumn[] = [
  { header: "ID", accessor: "id", visible: false, minWidth: 100 },
  { header: "Name", accessor: "name", visible: true },
  { header: "URL", accessor: "url", visible: true },
  { header: "Description", accessor: "description", visible: true },
  { header: "CreatedAt", accessor: "createdAt", visible: true },
  { header: "UpdatedAt", accessor: "updatedAt", visible: true },
  { header: "", accessor: "menu", visible: true, minWidth: 50 },
];

function FileList() {
  const [{ experiences }, { onCreate, onDelete, onSelect }] = useFileList();

  const generateTableData = (
    experiences: Experience[]
  ): {
    columns: TableColumn[];
    rows: TableRow[];
  } => {
    const columns = DefinedColumns.filter((c) => c.visible);

    const rows: TableRow[] = experiences.map((exp) => {
      return {
        id: exp.id,
        name: exp.name,
        url: exp.url,
        description: "",
        createdAt: dayjs.unix(exp.createdAt).format("YYYY/MM/DD HH:mm:ss"),
        updatedAt: dayjs.unix(exp.updatedAt).format("YYYY/MM/DD HH:mm:ss"),
        menu: (
          <Menu>
            <MenuButton
              size="sm"
              as={IconButton}
              aria-label="Options"
              variant="ghost"
              icon={<VscKebabVertical />}
              onClick={(e) => {
                e.stopPropagation();
              }}
            ></MenuButton>
            <MenuList>
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(exp.id);
                }}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        ),
      };
    });

    return { columns, rows };
  };

  const { rows, columns } = generateTableData(experiences);

  return (
    <Box maxW="1000px" mx="auto" overflow="hidden" h="100%">
      <Grid templateRows="auto 1fr" my={5} gap={4} height="100%">
        <GridItem
          as="header"
          position="sticky"
          top={0}
          zIndex="sticky"
          shadow="sm"
        >
          <HStack>
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none">
                <VscSearch />
              </InputLeftElement>
              <Input placeholder="Search Anything" />
            </InputGroup>

            <Button
              size="sm"
              leftIcon={<VscAdd />}
              colorScheme="teal"
              variant="solid"
              onClick={onCreate}
            >
              Create
            </Button>
          </HStack>
        </GridItem>
        <GridItem overflowY="scroll">
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {columns.map((column) => (
                    <Th key={column.accessor}>{column.header}</Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {rows.map((row) => (
                  <Tr
                    key={row.id}
                    _hover={{
                      cursor: "pointer",
                      bgColor: "rgba(255, 255, 255, 0.05)",
                    }}
                    onClick={() => {
                      onSelect(row.id);
                    }}
                  >
                    {columns.map((column) => (
                      <Td key={`${row.id}-${column.accessor}`}>
                        {row[column.accessor]}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </GridItem>
      </Grid>
    </Box>
  );
}

export { FileList };
